"use client";
import { Employee } from "@/lib/types";

/* ─── Minifigure SVG ─── */
function Minifigure({
  color,
  initials,
  status,
  label,
  x,
  y,
  onClick,
  delay = 0,
}: {
  color: string;
  initials: string;
  status: string;
  label: string;
  x: number;
  y: number;
  onClick?: () => void;
  delay?: number;
}) {
  const isWorking = status === "working";
  const isBreak = status === "break";
  const isMeeting = status === "meeting";
  const isOffline = status === "offline" || status === "time-off";

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
      className="minifigure-group"
    >
      {/* Shadow */}
      <ellipse cx={0} cy={38} rx={10} ry={3} fill="rgba(0,0,0,0.08)" />

      {/* Body */}
      <g style={{ animation: isWorking ? `fig-type 1.2s ease-in-out ${delay}s infinite` : isBreak ? `fig-sip 2.5s ease-in-out ${delay}s infinite` : isMeeting ? `fig-nod 2s ease-in-out ${delay}s infinite` : "none" }}>
        {/* Legs */}
        <rect x={-5} y={26} width={4} height={12} rx={2} fill={isOffline ? "#cbd5e1" : "#4b5563"} />
        <rect x={1} y={26} width={4} height={12} rx={2} fill={isOffline ? "#cbd5e1" : "#374151"} />

        {/* Torso */}
        <rect x={-8} y={10} width={16} height={18} rx={4} fill={isOffline ? "#e2e8f0" : color} opacity={isOffline ? 0.5 : 1} />

        {/* Arms */}
        {isWorking ? (
          <>
            {/* Arms reaching forward (typing) */}
            <rect x={-13} y={14} width={6} height={4} rx={2} fill={isOffline ? "#e2e8f0" : color} opacity={isOffline ? 0.5 : 0.85} transform="rotate(-15 -13 14)" />
            <rect x={7} y={14} width={6} height={4} rx={2} fill={isOffline ? "#e2e8f0" : color} opacity={isOffline ? 0.5 : 0.85} transform="rotate(15 7 14)" />
          </>
        ) : isBreak ? (
          <>
            {/* One arm holding coffee */}
            <rect x={-13} y={12} width={6} height={4} rx={2} fill={color} opacity={0.85} />
            <rect x={7} y={10} width={6} height={4} rx={2} fill={color} opacity={0.85} transform="rotate(-30 10 12)" />
            {/* Coffee cup */}
            <g transform="translate(12, 4)">
              <rect x={0} y={0} width={6} height={8} rx={2} fill="#d4a574" />
              <rect x={-1} y={0} width={8} height={2} rx={1} fill="#c49a6c" />
              {/* Steam */}
              <g className="coffee-steam">
                <path d="M2,-2 Q3,-5 2,-8" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" strokeLinecap="round" />
                <path d="M4,-1 Q5,-4 4,-7" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
              </g>
            </g>
          </>
        ) : (
          <>
            {/* Default arms at side */}
            <rect x={-13} y={12} width={6} height={4} rx={2} fill={isOffline ? "#e2e8f0" : color} opacity={isOffline ? 0.5 : 0.85} />
            <rect x={7} y={12} width={6} height={4} rx={2} fill={isOffline ? "#e2e8f0" : color} opacity={isOffline ? 0.5 : 0.85} />
          </>
        )}

        {/* Head */}
        <circle cx={0} cy={3} r={9} fill={isOffline ? "#e2e8f0" : color} opacity={isOffline ? 0.5 : 1} />
        <circle cx={0} cy={3} r={7.5} fill="rgba(255,255,255,0.2)" />

        {/* Initials on head */}
        <text x={0} y={6} textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff" fontFamily="var(--font)" style={{ pointerEvents: "none" }}>
          {initials}
        </text>

        {/* Status indicator */}
        <circle
          cx={7} cy={-4} r={3.5}
          fill={status === "working" ? "#10b981" : status === "break" ? "#f59e0b" : status === "meeting" ? "#6366f1" : "#94a3b8"}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={1.5}
        />
      </g>

      {/* Name label */}
      <text x={0} y={50} textAnchor="middle" fontSize="7" fontWeight="600" fill="var(--text-muted)" fontFamily="var(--font)" style={{ pointerEvents: "none" }}>
        {label}
      </text>
    </g>
  );
}

/* ─── Desk furniture SVG ─── */
function DeskFurniture({ x, y, hasMonitor = true }: { x: number; y: number; hasMonitor?: boolean }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Desk surface */}
      <rect x={-20} y={0} width={40} height={4} rx={2} fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.15)" strokeWidth={0.5} />
      {/* Desk legs */}
      <rect x={-18} y={4} width={3} height={12} rx={1} fill="rgba(139,92,246,0.08)" />
      <rect x={15} y={4} width={3} height={12} rx={1} fill="rgba(139,92,246,0.08)" />
      {hasMonitor && (
        <>
          {/* Monitor */}
          <rect x={-8} y={-14} width={16} height={12} rx={2} fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.2)" strokeWidth={0.5} />
          <rect x={-1} y={-2} width={2} height={3} fill="rgba(99,102,241,0.1)" />
          {/* Screen glow */}
          <rect x={-6} y={-12} width={12} height={8} rx={1} fill="rgba(99,102,241,0.08)" />
          {/* Keyboard */}
          <rect x={-7} y={-1} width={14} height={2} rx={0.5} fill="rgba(0,0,0,0.06)" />
        </>
      )}
    </g>
  );
}

/* ─── Plant decoration ─── */
function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-3} y={2} width={6} height={6} rx={2} fill="rgba(245,158,11,0.2)" />
      <ellipse cx={0} cy={0} rx={5} ry={5} fill="rgba(16,185,129,0.25)" />
      <ellipse cx={-3} cy={-2} rx={3} ry={4} fill="rgba(16,185,129,0.2)" />
      <ellipse cx={3} cy={-1} rx={3} ry={3.5} fill="rgba(16,185,129,0.18)" />
    </g>
  );
}

/* ─── Coffee Machine ─── */
function CoffeeMachine({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-8} y={-16} width={16} height={20} rx={3} fill="rgba(120,80,50,0.2)" stroke="rgba(120,80,50,0.15)" strokeWidth={0.5} />
      <rect x={-6} y={-12} width={12} height={8} rx={2} fill="rgba(80,50,30,0.15)" />
      <circle cx={0} cy={-8} r={2} fill="rgba(239,68,68,0.3)" />
      <rect x={-3} y={2} width={6} height={1} rx={0.5} fill="rgba(120,80,50,0.25)" />
      {/* Cup slot */}
      <rect x={-4} y={0} width={8} height={4} rx={1} fill="rgba(120,80,50,0.08)" />
    </g>
  );
}

/* ─── Couch ─── */
function Couch({ x, y, width = 50 }: { x: number; y: number; width?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Back */}
      <rect x={-width / 2} y={-8} width={width} height={8} rx={4} fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.1)" strokeWidth={0.5} />
      {/* Seat */}
      <rect x={-width / 2 + 2} y={0} width={width - 4} height={8} rx={3} fill="rgba(139,92,246,0.08)" />
      {/* Arms */}
      <rect x={-width / 2 - 2} y={-4} width={4} height={14} rx={2} fill="rgba(139,92,246,0.1)" />
      <rect x={width / 2 - 2} y={-4} width={4} height={14} rx={2} fill="rgba(139,92,246,0.1)" />
    </g>
  );
}

/* ─── Conference Table ─── */
function ConferenceTable({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={0} cy={0} rx={40} ry={14} fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.12)" strokeWidth={0.5} />
      {/* Center decoration */}
      <ellipse cx={0} cy={0} rx={8} ry={3} fill="rgba(99,102,241,0.06)" />
      {/* Legs */}
      <rect x={-2} y={10} width={4} height={8} rx={1} fill="rgba(99,102,241,0.06)" />
    </g>
  );
}

/* ─── Whiteboard ─── */
function Whiteboard({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-18} y={-20} width={36} height={22} rx={2} fill="rgba(255,255,255,0.4)" stroke="rgba(0,0,0,0.08)" strokeWidth={0.5} />
      <rect x={-1} y={2} width={2} height={10} fill="rgba(0,0,0,0.06)" />
      {/* Scribbles */}
      <line x1={-12} y1={-14} x2={8} y2={-14} stroke="rgba(99,102,241,0.2)" strokeWidth={1} strokeLinecap="round" />
      <line x1={-12} y1={-10} x2={4} y2={-10} stroke="rgba(239,68,68,0.15)" strokeWidth={1} strokeLinecap="round" />
      <line x1={-12} y1={-6} x2={10} y2={-6} stroke="rgba(16,185,129,0.15)" strokeWidth={1} strokeLinecap="round" />
    </g>
  );
}

/* ─── Zone label ─── */
function ZoneLabel({ x, y, label, icon }: { x: number; y: number; label: string; icon: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text textAnchor="start" fontSize="8" fontWeight="700" fill="var(--text-muted)" fontFamily="var(--font)" letterSpacing="0.08em" style={{ textTransform: "uppercase" } as React.CSSProperties}>
        {icon} {label}
      </text>
    </g>
  );
}

/* ─── Floor zone background ─── */
function FloorZone({ x, y, width, height, fill }: { x: number; y: number; width: number; height: number; fill: string }) {
  return (
    <rect x={x} y={y} width={width} height={height} rx={12} fill={fill} />
  );
}

/* ═══════════════════ Main Component ═══════════════════ */
export default function VirtualOfficeFloor({
  employees,
  onSelect,
  filter,
}: {
  employees: Employee[];
  onSelect: (emp: Employee) => void;
  filter: string;
}) {
  const working = employees.filter((e) => e.status === "working");
  const onBreak = employees.filter((e) => e.status === "break");
  const inMeeting = employees.filter((e) => e.status === "meeting");
  const offline = employees.filter((e) => e.status === "offline" || e.status === "time-off");

  const shouldShow = (emp: Employee) => filter === "all" || emp.status === filter;

  /* Dev area: 3 columns x 2 rows, 70px apart */
  const deskPositions = [
    { x: 100, y: 100 }, { x: 210, y: 100 }, { x: 320, y: 100 },
    { x: 100, y: 195 }, { x: 210, y: 195 }, { x: 320, y: 195 },
  ];

  /* Break room positions */
  const breakPositions = [
    { x: 520, y: 100 }, { x: 580, y: 100 }, { x: 640, y: 100 },
    { x: 550, y: 175 }, { x: 620, y: 175 },
  ];

  /* Meeting positions – around the table */
  const meetingPositions = [
    { x: 140, y: 340 }, { x: 210, y: 320 }, { x: 280, y: 340 },
    { x: 175, y: 375 }, { x: 245, y: 375 },
  ];

  /* Offline lounge */
  const offlinePositions = [
    { x: 500, y: 330 }, { x: 560, y: 330 }, { x: 620, y: 330 },
    { x: 530, y: 390 }, { x: 590, y: 390 },
  ];

  return (
    <div style={{ width: "100%", overflow: "hidden", borderRadius: 16 }}>
      <svg
        viewBox="0 0 740 440"
        style={{ width: "100%", height: "auto", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Floor pattern */}
        <defs>
          <pattern id="floor-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="none" />
            <line x1="30" y1="0" x2="30" y2="30" stroke="rgba(0,0,0,0.02)" strokeWidth="0.5" />
            <line x1="0" y1="30" x2="30" y2="30" stroke="rgba(0,0,0,0.02)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="740" height="440" rx="16" fill="url(#floor-grid)" />

        {/* ─── Development Zone ─── */}
        <FloorZone x={50} y={40} width={330} height={230} fill="rgba(99,102,241,0.03)" />
        <ZoneLabel x={64} y={62} label="Development Area" icon="💻" />

        {/* Desk furniture */}
        {deskPositions.map((pos, i) => (
          <DeskFurniture key={`desk-${i}`} x={pos.x} y={pos.y - 20} />
        ))}

        {/* Plants */}
        <Plant x={62} y={80} />
        <Plant x={370} y={140} />

        {/* Working employees at desks */}
        {working.filter(shouldShow).map((emp, i) => {
          const pos = deskPositions[i % deskPositions.length];
          return pos ? (
            <Minifigure
              key={emp.id}
              color={emp.color}
              initials={emp.initials}
              status={emp.status}
              label={emp.name.split(" ")[0]}
              x={pos.x}
              y={pos.y}
              onClick={() => onSelect(emp)}
              delay={i * 0.2}
            />
          ) : null;
        })}

        {/* Empty desks for remaining slots */}
        {working.filter(shouldShow).length < deskPositions.length &&
          Array.from({ length: deskPositions.length - working.filter(shouldShow).length }).map((_, i) => {
            const pos = deskPositions[working.filter(shouldShow).length + i];
            return (
              <g key={`empty-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle cx={0} cy={10} r={8} fill="rgba(0,0,0,0.02)" strokeDasharray="3 2" stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />
                <text x={0} y={13} textAnchor="middle" fontSize="6" fill="rgba(0,0,0,0.12)" fontFamily="var(--font)" fontWeight="600">+</text>
              </g>
            );
          })}

        {/* ─── Break Room ─── */}
        <FloorZone x={460} y={40} width={250} height={200} fill="rgba(245,158,11,0.03)" />
        <ZoneLabel x={474} y={62} label="Break Room" icon="☕" />

        <CoffeeMachine x={688} y={120} />
        <Couch x={580} y={210} width={60} />
        <Plant x={470} y={80} />

        {/* Break employees */}
        {onBreak.filter(shouldShow).map((emp, i) => {
          const pos = breakPositions[i % breakPositions.length];
          return pos ? (
            <Minifigure
              key={emp.id}
              color={emp.color}
              initials={emp.initials}
              status={emp.status}
              label={emp.name.split(" ")[0]}
              x={pos.x}
              y={pos.y}
              onClick={() => onSelect(emp)}
              delay={i * 0.3}
            />
          ) : null;
        })}

        {onBreak.filter(shouldShow).length === 0 && (
          <text x={580} y={140} textAnchor="middle" fontSize="7.5" fill="rgba(0,0,0,0.12)" fontFamily="var(--font)">
            Empty
          </text>
        )}

        {/* ─── Meeting Room ─── */}
        <FloorZone x={50} y={290} width={360} height={130} fill="rgba(99,102,241,0.03)" />
        <ZoneLabel x={64} y={312} label="Meeting Room" icon="🎯" />

        <ConferenceTable x={210} y={360} />
        <Whiteboard x={395} y={340} />

        {/* Meeting employees */}
        {inMeeting.filter(shouldShow).map((emp, i) => {
          const pos = meetingPositions[i % meetingPositions.length];
          return pos ? (
            <Minifigure
              key={emp.id}
              color={emp.color}
              initials={emp.initials}
              status={emp.status}
              label={emp.name.split(" ")[0]}
              x={pos.x}
              y={pos.y}
              onClick={() => onSelect(emp)}
              delay={i * 0.25}
            />
          ) : null;
        })}

        {inMeeting.filter(shouldShow).length === 0 && (
          <text x={210} y={365} textAnchor="middle" fontSize="7.5" fill="rgba(0,0,0,0.12)" fontFamily="var(--font)">
            No meetings
          </text>
        )}

        {/* ─── Offline / Away ─── */}
        <FloorZone x={460} y={275} width={250} height={145} fill="rgba(148,163,184,0.03)" />
        <ZoneLabel x={474} y={297} label="Away / Offline" icon="🌴" />

        {offline.filter(shouldShow).map((emp, i) => {
          const pos = offlinePositions[i % offlinePositions.length];
          return pos ? (
            <Minifigure
              key={emp.id}
              color={emp.color}
              initials={emp.initials}
              status={emp.status}
              label={emp.name.split(" ")[0]}
              x={pos.x}
              y={pos.y}
              onClick={() => onSelect(emp)}
              delay={0}
            />
          ) : null;
        })}

        {offline.filter(shouldShow).length === 0 && (
          <text x={585} y={360} textAnchor="middle" fontSize="7.5" fill="rgba(0,0,0,0.12)" fontFamily="var(--font)">
            Everyone&apos;s in!
          </text>
        )}

        {/* Divider lines (subtle) */}
        <line x1={430} y1={60} x2={430} y2={420} stroke="rgba(0,0,0,0.03)" strokeWidth={1} strokeDasharray="6 4" />
        <line x1={50} y1={280} x2={710} y2={280} stroke="rgba(0,0,0,0.03)" strokeWidth={1} strokeDasharray="6 4" />
      </svg>
    </div>
  );
}
