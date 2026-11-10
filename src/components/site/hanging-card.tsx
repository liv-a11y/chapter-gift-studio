import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Where the rope attaches on the child, in the child's own pixels. */
  hole: { x: number; y: number };
  /** Rope length at desktop width, in pixels. */
  rope?: number;
  /** Rope thickness in pixels. */
  thickness?: number;
  /** 0 is a dead weight, 1 is very springy. */
  bounce?: number;
  /** Resting tilt in degrees, for objects that hang off-center. */
  tilt?: number;
  /** Called the first time someone grabs it. */
  onGrab?: () => void;
  /** Positions the anchor point. The anchor itself has no size. */
  className?: string;
};

/**
 * Hangs its child from a rope and lets people drag and fling it.
 * Decorative: hidden from assistive tech, static under reduced motion.
 */
export function HangingCard({ children, hole, rope = 200, thickness = 3, bounce = 0.5, tilt = 0, onGrab, className = "" }: Props) {
  const onGrabRef = useRef(onGrab);
  onGrabRef.current = onGrab;
  const anchorRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    const body = bodyRef.current;
    const scaler = scaleRef.current;
    const path = pathRef.current;
    if (!anchor || !body || !scaler || !path) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scale = 1;
    let length = rope;
    const measure = () => {
      const w = window.innerWidth;
      scale = Math.min(1, Math.max(0.55, w / 1280));
      length = rope * scale;
      scaler.style.transform = `scale(${scale})`;
    };
    measure();

    // Position and velocity of the hole, relative to the anchor.
    const pos = { x: still ? 0 : length * 0.5, y: still ? length : length * 0.2 };
    const vel = { x: 0, y: 0 };
    let angle = 0;
    let dragging = false;
    const grab = { x: 0, y: 0 };
    let last = 0;
    let frame = 0;

    const gravity = 2600;
    const stiffness = 90 + (1 - bounce) * 260;
    const drag = 1.2 + (1 - bounce) * 2.4;

    const draw = () => {
      const dist = Math.hypot(pos.x, pos.y);
      // A slack rope sags; a taut or stretched one is straight.
      const sag = dist < length ? Math.sqrt(length * length - dist * dist) * 0.5 : 0;
      path.setAttribute("d", `M 0 0 Q ${pos.x / 2} ${pos.y / 2 + sag} ${pos.x} ${pos.y}`);
      const target = dist > 1 ? -Math.atan2(pos.x, pos.y) : 0;
      angle += (target - angle) * 0.35;
      body.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${angle + (tilt * Math.PI) / 180}rad)`;
    };

    const step = (dt: number) => {
      const dist = Math.hypot(pos.x, pos.y) || 1;
      let ax = 0;
      let ay = gravity;
      if (dist > length) {
        const pull = stiffness * (dist - length);
        ax -= (pos.x / dist) * pull;
        ay -= (pos.y / dist) * pull;
      }
      vel.x += (ax - vel.x * drag) * dt;
      vel.y += (ay - vel.y * drag) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
      // Never let a hard throw carry it up past the anchor.
      const floor = length * 0.25;
      if (pos.y < floor) {
        pos.y = floor;
        vel.y = Math.abs(vel.y) * 0.2;
      }
      const reach = length * 1.8;
      if (Math.abs(pos.x) > reach) {
        pos.x = Math.sign(pos.x) * reach;
        vel.x *= -0.2;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (!dragging) {
        step(dt / 2);
        step(dt / 2);
      }
      draw();
      const settled = !dragging && Math.hypot(vel.x, vel.y) < 2 && Math.abs(pos.x) < 0.5;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (frame || still) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const local = (e: PointerEvent) => {
      const r = anchor.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    let lastMove = 0;
    const down = (e: PointerEvent) => {
      if (still) return;
      const p = local(e);
      dragging = true;
      onGrabRef.current?.();
      grab.x = p.x - pos.x;
      grab.y = p.y - pos.y;
      lastMove = performance.now();
      body.setPointerCapture(e.pointerId);
      body.style.cursor = "grabbing";
      wake();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const p = local(e);
      const now = performance.now();
      const dt = Math.max((now - lastMove) / 1000, 1 / 240);
      const nx = p.x - grab.x;
      const ny = p.y - grab.y;
      // Keep some of the hand's speed so a release reads as a throw.
      vel.x = vel.x * 0.5 + ((nx - pos.x) / dt) * 0.5;
      vel.y = vel.y * 0.5 + ((ny - pos.y) / dt) * 0.5;
      pos.x = nx;
      pos.y = ny;
      lastMove = now;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      body.releasePointerCapture(e.pointerId);
      body.style.cursor = "grab";
      wake();
    };
    const resize = () => {
      measure();
      wake();
      if (still) {
        pos.y = length;
        draw();
      }
    };

    body.addEventListener("pointerdown", down);
    body.addEventListener("pointermove", move);
    body.addEventListener("pointerup", up);
    body.addEventListener("pointercancel", up);
    window.addEventListener("resize", resize);
    anchor.style.opacity = "1";
    draw();
    wake();

    return () => {
      cancelAnimationFrame(frame);
      body.removeEventListener("pointerdown", down);
      body.removeEventListener("pointermove", move);
      body.removeEventListener("pointerup", up);
      body.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", resize);
    };
  }, [rope, bounce, tilt]);

  return (
    <div ref={anchorRef} aria-hidden="true" className={`pointer-events-none absolute z-20 size-0 opacity-0 ${className}`}>
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
        <path ref={pathRef} fill="none" stroke="currentColor" strokeWidth={thickness} strokeLinecap="round" />
      </svg>
      <div ref={bodyRef} className="pointer-events-auto absolute left-0 top-0 size-0 cursor-grab touch-none select-none">
        <div ref={scaleRef} className="absolute left-0 top-0 size-0 origin-top-left">
          <div className="absolute" style={{ left: -hole.x, top: -hole.y }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/** A house key, drawn for this site. The rope hole sits at (60, 34). */
export function KeyShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 250" width="120" height="250" className={className} role="presentation">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M60 0a56 56 0 0 1 22 107.500V232l-16 18H54l-12-14v-12l10-8-10-10v-12l10-8-10-10V107.500A56 56 0 0 1 60 0Zm0 22a12 12 0 1 0 0 24 12 12 0 0 0 0-24Z"
      />
    </svg>
  );
}
