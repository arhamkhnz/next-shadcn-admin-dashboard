import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  Bell,
  Bold,
  CalendarDays,
  ChevronDown,
  Code2,
  Download,
  Flame,
  Hash,
  Heart,
  Italic,
  Link2,
  List,
  Lock,
  Maximize2,
  Mic,
  MoreHorizontal,
  PenLine,
  Pin,
  Plus,
  Quote,
  Send,
  Smile,
  Strikethrough,
  ThumbsUp,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";

const conversations = [
  {
    title: "Product Design",
    preview: "You: Here's the latest mockup for...",
    time: "9:41 AM",
    tone: "violet",
    unread: "2",
    locked: true,
    active: true,
    kind: "group",
  },
  {
    title: "Zoe Mitchell",
    preview: "Thanks! That clarifies it.",
    time: "9:27 AM",
    tone: "rose",
    unread: "1",
    kind: "person",
  },
  {
    title: "Engineering Sync",
    preview: "Alex: See you all tomorrow!",
    time: "8:15 AM",
    tone: "coral",
    muted: true,
    kind: "calendar",
  },
  {
    title: "Alex Rivera",
    preview: "Sounds good, let's do it.",
    time: "Yesterday",
    tone: "emerald",
    online: true,
    kind: "person",
  },
  {
    title: "Design Critique",
    preview: "Priya: Love the direction here",
    time: "Yesterday",
    tone: "violet",
    kind: "group",
  },
  {
    title: "Sales Team",
    preview: "Jordan: Q2 targets are up",
    time: "Yesterday",
    tone: "teal",
    unread: "3",
    kind: "group",
  },
  {
    title: "Marketing",
    preview: "Taylor: Campaign assets are live.",
    time: "Monday",
    tone: "pink",
    kind: "group",
  },
  {
    title: "Priya Shah",
    preview: "Shared a file",
    time: "Monday",
    tone: "slate",
    kind: "person",
  },
  {
    title: "# random",
    preview: "Sam: Weekend plans?",
    time: "Sunday",
    tone: "lavender",
    kind: "hash",
  },
  {
    title: "Customer Feedback",
    preview: "Jamie: New thread",
    time: "Friday",
    tone: "orange",
    kind: "customer",
  },
] as const;

const people = [
  { name: "Priya Shah", initials: "PS", tone: "slate" },
  { name: "Jordan Lee", initials: "JL", tone: "amber" },
  { name: "Alex Rivera", initials: "AR", tone: "emerald" },
  { name: "Mira Chen", initials: "MC", tone: "stone" },
  { name: "Zoe Mitchell", initials: "ZM", tone: "rose" },
] as const;

const sharedFiles = [
  { name: "Dashboard v2 - High Fidelity.fig", meta: "Figma file - 24.6 MB", date: "Today", type: "figma" },
  { name: "Design System Updates.pdf", meta: "PDF file - 1.2 MB", date: "Yesterday", type: "pdf" },
  { name: "User Research - Q2 Summary.docx", meta: "Word document - 3.4 MB", date: "May 12", type: "word" },
  { name: "Icon Library.sketch", meta: "Sketch file - 18.7 MB", date: "May 10", type: "sketch" },
] as const;

const avatarToneClasses = {
  amber: "bg-[#f3c56a] text-[#3c2807]",
  coral: "bg-[#ff828c] text-white",
  emerald: "bg-[#233428] text-white",
  lavender: "bg-[#edeaff] text-[#3b3565]",
  orange: "bg-[#fff0e8] text-[#ef6844]",
  pink: "bg-[#f35c91] text-white",
  rose: "bg-[#f4d3ca] text-[#5d322d]",
  slate: "bg-[#242b35] text-white",
  stone: "bg-[#dacabd] text-[#44342b]",
  teal: "bg-[#149c9b] text-white",
  violet: "bg-[#8354e9] text-white",
};

type AvatarTone = keyof typeof avatarToneClasses;

function Avatar({ initials, tone, className = "" }: { initials: string; tone: AvatarTone; className?: string }) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full font-semibold ${avatarToneClasses[tone]} ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
}

function ConversationIcon({ item }: { item: (typeof conversations)[number] }) {
  const base = `relative flex size-13 shrink-0 items-center justify-center rounded-full ${avatarToneClasses[item.tone]}`;

  if (item.kind === "group") {
    return (
      <div className={base}>
        <Users className="size-5" />
      </div>
    );
  }

  if (item.kind === "calendar") {
    return (
      <div className={base}>
        <CalendarDays className="size-5" />
      </div>
    );
  }

  if (item.kind === "hash") {
    return (
      <div className={base}>
        <Hash className="size-6" />
      </div>
    );
  }

  if (item.kind === "customer") {
    return (
      <div className={base}>
        <UserPlus className="size-5" />
      </div>
    );
  }

  return (
    <div className={base}>
      <span className="font-semibold text-sm">
        {item.title
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </span>
      {"online" in item && item.online && (
        <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-[#20c873]" />
      )}
    </div>
  );
}

function FigmaMark({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-0.5 ${className}`}>
      <span className="size-2.5 rounded-full bg-[#ff6b5a]" />
      <span className="size-2.5 rounded-full bg-[#ff8a00]" />
      <span className="size-2.5 rounded-full bg-[#a259ff]" />
      <span className="size-2.5 rounded-full bg-[#1abcfe]" />
      <span className="size-2.5 rounded-full bg-[#0acf83]" />
    </div>
  );
}

function FileGlyph({ type }: { type: (typeof sharedFiles)[number]["type"] }) {
  if (type === "figma") {
    return <FigmaMark className="size-8 content-center rounded-md bg-white p-1" />;
  }

  if (type === "word") {
    return (
      <div className="flex size-8 items-center justify-center rounded-md bg-[#e8f1ff] font-bold text-[#2571e8] text-sm">
        W
      </div>
    );
  }

  if (type === "sketch") {
    return (
      <div className="flex size-8 items-center justify-center rounded-md bg-[#fff4cf] font-bold text-[#f0a600] text-sm">
        S
      </div>
    );
  }

  return (
    <div className="flex size-8 items-center justify-center rounded-md border border-[#ffcfca] font-bold text-[#ff6e63] text-sm">
      P
    </div>
  );
}

function ReactionPill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#e7eaf0] bg-white px-3 font-medium text-[#4d5568] text-sm shadow-[0_1px_2px_rgba(18,24,40,0.04)]">
      <Icon className="size-4 text-[#3167f1]" />
      {label}
    </button>
  );
}

function MiniDashboard() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#dfe4ed] bg-[#f7f9fc]">
      <div className="grid h-72 grid-cols-[116px_1fr] text-[#6c7280] text-[10px]">
        <aside className="border-[#e2e7ef] border-r bg-[#eef3fb] p-4">
          <div className="mb-5 flex items-center gap-2 font-semibold text-[#202738]">
            <span className="flex size-5 items-center justify-center rounded bg-[#3778ff] text-[9px] text-white">
              AI
            </span>
            Overview
          </div>
          {["Reports", "Customers", "Analytics", "Settings"].map((item) => (
            <div key={item} className="mb-4 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#bdc7d5]" />
              {item}
            </div>
          ))}
        </aside>
        <section className="p-5">
          <h3 className="mb-4 font-semibold text-[#1f2633] text-sm">Overview</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Total Revenue", "$24.8K", "+12.5%"],
              ["New Customers", "1,429", "+8.2%"],
              ["Active Users", "2,893", "+4.1%"],
            ].map(([label, value, delta]) => (
              <div key={label} className="rounded-lg border border-[#e4e8f0] bg-white p-4">
                <p className="font-medium text-[#6f7785] text-[10px]">{label}</p>
                <div className="mt-2 flex items-end justify-between">
                  <strong className="text-[#222a36] text-base">{value}</strong>
                  <span className="font-semibold text-[#20a66b] text-[9px]">{delta}</span>
                </div>
                <div className="mt-4 flex h-8 items-end gap-1">
                  {[13, 20, 17, 30, 12, 24].map((height, index) => (
                    <span key={`${label}-${index}`} className="w-2 rounded-t bg-[#79a1ff]" style={{ height }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-[1.4fr_1fr] gap-3">
            <div className="rounded-lg border border-[#e4e8f0] bg-white p-4">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#6f7785] text-[10px]">Revenue</p>
                  <strong className="text-[#222a36] text-base">$24.8K</strong>
                </div>
                <span className="rounded-md bg-[#f5f7fb] px-2 py-1 text-[9px]">This month</span>
              </div>
              <div className="relative h-20 overflow-hidden rounded-md bg-gradient-to-b from-[#f4f7ff] to-white">
                <svg viewBox="0 0 260 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <path
                    d="M0 70 C35 40 52 84 80 55 C110 25 116 80 144 58 C174 35 185 38 210 30 C230 23 246 19 260 10"
                    fill="none"
                    stroke="#6690ff"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            </div>
            <div className="rounded-lg border border-[#e4e8f0] bg-white p-4">
              <p className="mb-4 font-semibold text-[#222a36] text-[10px]">Top Products</p>
              {["Pro Plan", "Basic Plan", "Enterprise"].map((name, index) => (
                <div key={name} className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="size-2 rounded-full bg-[#a8b4c8]" />
                    <span className="truncate">{name}</span>
                  </div>
                  <span className="font-semibold text-[#343c4a]">${[12.4, 6.1, 3.4][index]}K</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MessageComposer() {
  return (
    <div className="border-[#eef1f5] border-t bg-white px-5 py-5 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[#dfe3eb] bg-white shadow-[0_4px_18px_rgba(25,31,46,0.08)]">
        <div className="px-5 pt-4 pb-5 text-[#9aa1ae] text-lg">Message Product Design</div>
        <div className="flex h-12 items-center gap-5 border-[#edf0f5] border-t px-5 text-[#7b8495]">
          <Bold className="size-5" />
          <Italic className="size-5" />
          <Strikethrough className="size-5" />
          <Code2 className="size-5" />
          <Link2 className="size-5" />
          <span className="h-5 w-px bg-[#e3e7ee]" />
          <List className="size-5" />
          <List className="size-5" />
          <Quote className="size-5" />
          <Maximize2 className="size-5" />
        </div>
        <div className="flex h-16 items-center justify-between border-[#edf0f5] border-t px-4">
          <div className="flex items-center gap-5 text-[#7b8495]">
            <button className="flex size-9 items-center justify-center rounded-lg border border-[#cfe0ff] text-[#3167f1]">
              <Plus className="size-5" />
            </button>
            <button className="font-semibold text-[#3167f1]">Aa</button>
            <span className="h-5 w-px bg-[#e3e7ee]" />
            <Smile className="size-5" />
            <AtSign className="size-5" />
            <Video className="size-5" />
            <Mic className="size-5" />
          </div>
          <button className="flex h-11 overflow-hidden rounded-xl bg-[#2f67e8] text-white shadow-[0_4px_10px_rgba(49,103,241,0.28)]">
            <span className="flex w-13 items-center justify-center border-white/20 border-r">
              <Send className="size-5" />
            </span>
            <span className="flex w-11 items-center justify-center">
              <ChevronDown className="size-5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TestChatPage() {
  return (
    <main className="h-dvh min-h-[720px] overflow-hidden bg-[#fbfbfd] text-[#202533]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(620px,1fr)_440px]">
        <aside className="hidden min-w-0 flex-col border-[#e8ebf0] border-r bg-white lg:flex">
          <div className="flex h-16 items-center justify-between px-7">
            <button className="flex items-center gap-2 font-semibold text-[#252a36] text-base">
              All conversations
              <ChevronDown className="size-4 text-[#667085]" />
            </button>
            <button className="flex size-10 items-center justify-center rounded-xl border border-[#e1e5ec] text-[#353b48] shadow-[0_2px_8px_rgba(25,31,46,0.06)]">
              <PenLine className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 border-[#eef1f5] border-b px-6 font-semibold text-[#707789] text-sm">
            <button className="border-[#3167f1] border-b-2 py-4 text-[#3167f1]">Focused</button>
            <button className="py-4">Unread</button>
            <button className="py-4">@ Mentions</button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
            {conversations.map((item) => (
              <button
                key={item.title}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${"active" in item && item.active ? "bg-[#eff3ff]" : "hover:bg-[#f8f9fb]"}`}
              >
                <ConversationIcon item={item} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate font-semibold text-[#232936]">
                      {item.title}
                      {"locked" in item && item.locked && <Lock className="ml-1 inline size-3 text-[#7d8492]" />}
                    </span>
                    <span className="shrink-0 text-[#727a89] text-sm">{item.time}</span>
                  </span>
                  <span className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate text-[#697283] text-sm">{item.preview}</span>
                    {"unread" in item && item.unread && (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#3167f1] font-bold text-white text-xs">
                        {item.unread}
                      </span>
                    )}
                    {"muted" in item && item.muted && <Bell className="size-4 shrink-0 text-[#9aa2b0]" />}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-w-0 flex-col bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5 flex justify-center">
                <span className="rounded-xl border border-[#e2e6ed] bg-white px-8 py-2.5 font-medium text-[#667085] text-sm shadow-[0_1px_3px_rgba(25,31,46,0.04)]">
                  Tuesday, May 14
                </span>
              </div>

              <div className="space-y-7">
                <article className="flex gap-4">
                  <Avatar initials="PS" tone="slate" className="size-13" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline gap-3">
                      <h2 className="font-semibold text-[#222836]">Priya Shah</h2>
                      <span className="text-[#8c94a3] text-sm">9:15 AM</span>
                    </div>
                    <p className="text-[#333a49]">Morning team! Sharing the latest design updates for the dashboard.</p>
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-[#dfe4ec] bg-white p-4 shadow-[0_1px_2px_rgba(25,31,46,0.03)]">
                      <div className="flex items-center gap-4">
                        <FigmaMark className="size-9 content-center" />
                        <div>
                          <p className="font-semibold text-[#252b38]">Dashboard v2 - High Fidelity.fig</p>
                          <p className="text-[#7c8493] text-sm">Figma file - 24.6 MB</p>
                        </div>
                      </div>
                      <Download className="size-5 text-[#4f5665]" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <ReactionPill icon={ThumbsUp} label="4" />
                      <ReactionPill icon={Heart} label="2" />
                      <button className="flex size-8 items-center justify-center rounded-full border border-[#e7eaf0] bg-white text-[#6f7787]">
                        <Smile className="size-4" />
                      </button>
                    </div>
                  </div>
                </article>

                <article className="flex gap-4">
                  <Avatar initials="PS" tone="slate" className="size-13" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline gap-3">
                      <h2 className="font-semibold text-[#222836]">You</h2>
                      <span className="text-[#8c94a3] text-sm">9:41 AM</span>
                    </div>
                    <p className="mb-4 text-[#333a49]">
                      Here's the latest mockup for the overview section. Let me know what you think!
                    </p>
                    <MiniDashboard />
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <ReactionPill icon={Flame} label="5" />
                      <ReactionPill icon={ThumbsUp} label="2" />
                      <ReactionPill icon={Heart} label="1" />
                      <button className="flex size-8 items-center justify-center rounded-full border border-[#e7eaf0] bg-white text-[#6f7787]">
                        <Smile className="size-4" />
                      </button>
                    </div>
                  </div>
                </article>

                <article className="flex gap-4">
                  <Avatar initials="AR" tone="emerald" className="size-13" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline gap-3">
                      <h2 className="font-semibold text-[#222836]">Alex Rivera</h2>
                      <span className="text-[#8c94a3] text-sm">10:02 AM</span>
                    </div>
                    <p className="text-[#333a49]">This looks great! I especially like the new visual hierarchy.</p>
                    <div className="mt-4 flex items-center gap-2">
                      <ReactionPill icon={ThumbsUp} label="2" />
                      <button className="flex size-8 items-center justify-center rounded-full border border-[#e7eaf0] bg-white text-[#6f7787]">
                        <Smile className="size-4" />
                      </button>
                    </div>
                  </div>
                </article>

                <div className="flex justify-center">
                  <span className="rounded-xl border border-[#e2e6ed] bg-white px-8 py-2.5 font-medium text-[#667085] text-sm shadow-[0_1px_3px_rgba(25,31,46,0.04)]">
                    Wednesday, May 15
                  </span>
                </div>

                <article className="flex gap-4">
                  <Avatar initials="ZM" tone="rose" className="size-13" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline gap-3">
                      <h2 className="font-semibold text-[#222836]">Zoe Mitchell</h2>
                      <span className="text-[#8c94a3] text-sm">11:07 AM</span>
                    </div>
                    <p className="text-[#333a49]">
                      Quick question: should we show the percentage change next to all metrics?
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-sm">
                      <div className="flex -space-x-2">
                        <Avatar initials="AR" tone="emerald" className="size-6 border-2 border-white text-[10px]" />
                        <Avatar initials="PS" tone="slate" className="size-6 border-2 border-white text-[10px]" />
                        <Avatar initials="ZM" tone="rose" className="size-6 border-2 border-white text-[10px]" />
                      </div>
                      <button className="font-semibold text-[#3167f1]">3 replies</button>
                      <span className="text-[#8a91a1]">Last reply today at 9:27 AM</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <MessageComposer />
        </section>

        <aside className="hidden min-w-0 flex-col border-[#e7eaf0] border-l bg-white xl:flex">
          <div className="flex h-16 items-center justify-between border-[#e8ebf0] border-b px-6">
            <div className="flex h-full items-center gap-8 font-semibold text-base">
              <button className="h-full border-[#3167f1] border-b-2 px-2 text-[#3167f1]">Details</button>
              <button className="h-full px-2 text-[#626a79]">Apps</button>
            </div>
            <button className="text-[#3d4452]">
              <X className="size-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <section className="border-[#edf0f4] border-b px-7 py-8">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#8354e9] text-white">
                <Users className="size-8" />
              </div>
              <h2 className="mb-2 flex items-center gap-2 font-semibold text-2xl text-[#202633]">
                Product Design <Lock className="size-4 text-[#747d8c]" />
              </h2>
              <p className="max-w-xs text-[#535c6d] leading-7">
                Internal space for all product design discussions and updates.
              </p>
              <div className="mt-8 grid grid-cols-4 gap-8 text-center text-[#6f7787] text-sm">
                {[
                  [Bell, "Mute"],
                  [Pin, "Pin"],
                  [UserPlus, "Add"],
                  [MoreHorizontal, "More"],
                ].map(([Icon, label]) => (
                  <button key={label as string} className="space-y-2">
                    <span className="mx-auto flex size-16 items-center justify-center rounded-xl border border-[#e7eaf0] bg-white text-[#454d5c]">
                      <Icon className="size-5" />
                    </span>
                    <span>{label as string}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="border-[#edf0f4] border-b px-7 py-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold text-[#202633] text-lg">
                  Members <span className="font-normal text-[#7a8291]">17</span>
                </h3>
                <ChevronDown className="size-5 -rotate-90 text-[#535c6d]" />
              </div>
              <div className="flex items-center">
                {people.map((person) => (
                  <Avatar
                    key={person.name}
                    initials={person.initials}
                    tone={person.tone}
                    className="-mr-2 size-11 border-2 border-white text-xs"
                  />
                ))}
                <div className="flex size-11 items-center justify-center rounded-full bg-[#f0f2f7] font-semibold text-[#697284] text-sm">
                  +11
                </div>
              </div>
            </section>

            <section className="border-[#edf0f4] border-b px-7 py-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold text-[#202633] text-lg">Shared files</h3>
                <button className="font-semibold text-[#3167f1]">See all</button>
              </div>
              <div className="space-y-3">
                {sharedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-4 rounded-xl border border-[#e6eaf0] bg-white p-4"
                  >
                    <FileGlyph type={file.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#2a303c]">{file.name}</p>
                      <p className="text-[#7b8494] text-sm">{file.meta}</p>
                    </div>
                    <span className="text-[#737c8b] text-sm">{file.date}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="px-7 py-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold text-[#202633] text-lg">Integrations</h3>
                <button className="font-semibold text-[#3167f1]">See all</button>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <FigmaMark className="size-11 content-center rounded-xl border border-[#e7eaf0] bg-white p-2" />
                  <div>
                    <p className="font-semibold text-[#2a303c]">Figma</p>
                    <p className="text-[#6f7787] text-sm">
                      Connected <span className="ml-1 inline-block size-2 rounded-full bg-[#20b768]" />
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-[#e7eaf0] bg-white font-bold text-[#2563eb]">
                    J
                  </div>
                  <div>
                    <p className="font-semibold text-[#2a303c]">Jira</p>
                    <p className="text-[#6f7787] text-sm">
                      Connected <span className="ml-1 inline-block size-2 rounded-full bg-[#20b768]" />
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
