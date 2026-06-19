import FullCalendar, { type CalendarOptions, type DayCellInfo } from '@fullcalendar/react'
import '@fullcalendar/react/skeleton.css'
import { cn } from '@/lib/utils'

const xxsTextClass = 'text-[0.6875rem]/[1.090909]'

const blockPointerResizerClass = 'absolute hidden group-hover:block'
const rowPointerResizerClass = `${blockPointerResizerClass} inset-y-0 w-2`
const columnPointerResizerClass = `${blockPointerResizerClass} inset-x-0 h-2`

const blockTouchResizerClass = 'absolute size-2 border border-(--fc-event-color) bg-background rounded-full'
const rowTouchResizerClass = `${blockTouchResizerClass} top-1/2 -mt-1`
const columnTouchResizerClass = `${blockTouchResizerClass} left-1/2 -ml-1`

const tallDayCellBottomClass = 'min-h-3'
const getShortDayCellBottomClass = (info: DayCellInfo) => cn(
  !info.isNarrow && 'min-h-0.5'
)

const dayRowCommonClasses: CalendarOptions = {

  /* Day Row > List-Item Event
  ----------------------------------------------------------------------------------------------- */

  listItemEventClass: (info) => cn(
    'mb-px p-px rounded-sm',
    info.isNarrow ? 'mx-0.5' : 'mx-1',
    info.isSelected
      ? 'bg-foreground/5'
      : 'hover:bg-foreground/5',
  ),
  listItemEventInnerClass: (info) => cn(
    'flex flex-row items-center justify-between',
    info.isNarrow
      ? `py-px ${xxsTextClass}`
      : 'py-0.5 text-xs',
  ),
  listItemEventTimeClass: (info) => cn(
    info.isNarrow ? 'px-px' : 'px-0.5',
    'order-1 whitespace-nowrap overflow-hidden shrink-1',
  ),
  listItemEventTitleClass: (info) => cn(
    info.isNarrow ? 'px-px' : 'px-0.5',
    'font-medium whitespace-nowrap overflow-hidden shrink-100',
    info.timeText && 'text-ellipsis',
  ),

  /* Day Row > Row Event
  ----------------------------------------------------------------------------------------------- */

  rowEventClass: (info) => cn(
    info.isStart && (info.isNarrow ? 'ms-0.5' : 'ms-1'),
    info.isEnd && (info.isNarrow ? 'me-0.5' : 'me-1'),
  ),
  rowEventInnerClass: (info) => cn(info.isNarrow ? 'py-px' : 'py-0.5'),

  /* Day Row > More-Link
  ----------------------------------------------------------------------------------------------- */

  rowMoreLinkClass: (info) => cn(
    'mb-px border rounded-sm',
    info.isNarrow
      ? 'mx-0.5 border-primary hover:bg-foreground/5'
      : 'self-start mx-1 border-transparent bg-foreground/5 hover:bg-foreground/10',
  ),
  rowMoreLinkInnerClass: (info) => cn(
    info.isNarrow
      ? `p-px ${xxsTextClass}`
      : 'p-0.5 text-xs',
  ),
}

export type EventCalendarViewProps =
  CalendarOptions &
  Required<Pick<CalendarOptions, 'popoverCloseContent'>> // ensure callers define icons

export function EventCalendarViews({
  height,
  views: userViews,
  ...restOptions
}: EventCalendarViewProps) {
  return (
    <FullCalendar
      height={height}

        /* Abstract Event
        ----------------------------------------------------------------------------------------- */

        eventShortHeight={50}
        eventColor='var(--primary)'
        eventContrastColor='var(--primary-foreground)'
        eventClass={(info) => cn(
          info.isSelected
            ? ['outline-3', info.isDragging && 'shadow-lg']
            : 'focus-visible:outline-3',
          'outline-ring/50',
        )}

        /* Background Event
        ----------------------------------------------------------------------------------------- */

        backgroundEventColor='var(--chart-3)'
        backgroundEventClass='not-print:bg-[color-mix(in_oklab,var(--fc-event-color)_10%,transparent)] print:border-1 print:border-(--fc-event-color)'
        backgroundEventTitleClass={(info) => cn(
          'opacity-50 italic',
          (info.isNarrow || info.isShort)
            ? `p-1 ${xxsTextClass}`
            : 'p-2 text-xs',
        )}

        /* List-Item Event
        ----------------------------------------------------------------------------------------- */

        listItemEventTimeClass='text-muted-foreground'

        /* Block Event
        ----------------------------------------------------------------------------------------- */

        blockEventClass={(info) => cn(
          'group relative border-transparent print:border-(--fc-event-color) bg-(--fc-event-color) print:bg-white hover:bg-[color-mix(in_oklab,var(--fc-event-color)_92%,var(--fc-event-contrast-color))]',
          info.isInteractive && 'active:bg-[color-mix(in_oklab,var(--fc-event-color)_85%,var(--fc-event-contrast-color))]',
          (info.isDragging && !info.isSelected) && 'opacity-75',
        )}
        blockEventInnerClass='text-(--fc-event-contrast-color) print:text-black'
        blockEventTimeClass='whitespace-nowrap overflow-hidden shrink-1'
        blockEventTitleClass='whitespace-nowrap overflow-hidden shrink-100'

        /* Row Event
        ----------------------------------------------------------------------------------------- */

        rowEventClass={(info) => cn(
          'mb-px border-y',
          info.isStart && 'rounded-s-sm border-s',
          info.isEnd && 'rounded-e-sm border-e',
        )}
        rowEventBeforeClass={(info) => cn(
          info.isStartResizable && [
            info.isSelected ? rowTouchResizerClass : rowPointerResizerClass,
            '-start-1',
          ]
        )}
        rowEventAfterClass={(info) => cn(
          info.isEndResizable && [
            info.isSelected ? rowTouchResizerClass : rowPointerResizerClass,
            '-end-1',
          ]
        )}
        rowEventInnerClass={(info) => cn(
          'flex flex-row items-center',
          info.isNarrow ? xxsTextClass : 'text-xs',
        )}
        rowEventTimeClass={(info) => cn(
          info.isNarrow ? 'ps-0.5' : 'ps-1'
        )}
        rowEventTitleClass={(info) => cn(
          info.isNarrow ? 'px-0.5' : 'px-1',
          'font-medium',
        )}

        /* Column Event
        ----------------------------------------------------------------------------------------- */

        columnEventClass={(info) => cn(
          'border-x ring ring-background',
          info.isStart && ['border-t rounded-t-lg', info.isNarrow ? 'mt-px' : 'mt-0.5'],
          info.isEnd && ['border-b rounded-b-lg', info.isNarrow ? 'mb-px' : 'mb-0.5'],
        )}
        columnEventBeforeClass={(info) => cn(
          info.isStartResizable && [
            info.isSelected ? columnTouchResizerClass : columnPointerResizerClass,
            '-top-1',
          ]
        )}
        columnEventAfterClass={(info) => cn(
          info.isEndResizable && [
            info.isSelected ? columnTouchResizerClass : columnPointerResizerClass,
            '-bottom-1',
          ]
        )}
        columnEventInnerClass={(info) => cn(
          'flex',
          info.isShort
            ? 'flex-row items-center gap-1 p-1'
            : ['flex-col', info.isNarrow ? 'px-1 py-0.5' : 'px-2 py-1'],
          (info.isNarrow || info.isShort) ? xxsTextClass : 'text-xs',
        )}
        columnEventTimeClass={(info) => cn(
          !info.isShort && (info.isNarrow ? 'pt-0.5' : 'pt-1')
        )}
        columnEventTitleClass={(info) => cn(
          !info.isShort && (info.isNarrow ? 'py-0.5' : 'py-1'),
          'font-medium',
        )}

        /* More-Link
        ----------------------------------------------------------------------------------------- */

        moreLinkClass="focus-visible:outline-3 outline-ring/50"
        moreLinkInnerClass='whitespace-nowrap overflow-hidden'
        columnMoreLinkClass="my-0.5 border border-transparent print:border-black rounded-md bg-[color-mix(in_oklab,var(--foreground)_10%,var(--background))] hover:bg-[color-mix(in_oklab,var(--foreground)_13%,var(--background))] print:bg-white ring ring-background"
        columnMoreLinkInnerClass={(info) => cn(
          info.isNarrow
            ? `p-0.5 ${xxsTextClass}`
            : 'p-1 text-xs',
        )}

        /* Day Header
        ----------------------------------------------------------------------------------------- */

        dayHeaderClass={(info) => cn(
          'justify-center',
          info.inPopover ? 'border-b bg-foreground/5' :
            info.isMajor && 'border border-foreground/20',
        )}
        dayHeaderInnerClass={(info) => cn(
          'flex flex-row items-center',
          info.isNarrow ? 'text-xs' : 'text-sm',
          info.inPopover ? [
            'm-1.5 px-1 py-0.5 rounded-sm font-semibold',
            info.hasNavLink && 'hover:bg-foreground/5',
          ] : !info.dayNumberText ? [
            'mx-0.5 my-1.5 py-0.5 px-1.5 rounded-sm text-muted-foreground',
            info.hasNavLink && 'hover:bg-foreground/5',
          ] : !info.isToday ? [
            'mx-2 my-2.5 h-6 px-1.5 rounded-sm text-muted-foreground',
            info.hasNavLink && 'hover:bg-foreground/5',
          ] : (
            'group mx-2 my-2 h-7 outline-none'
          )
        )}
        dayHeaderContent={(info) => (
          (info.inPopover || !info.dayNumberText || !info.isToday) ? (
            <>{info.text}</>
          ) : (
            <>
              {info.textParts.map((textPart, i) => (
                <span
                  key={i}
                  className={cn(
                    'whitespace-pre',
                    (textPart.type === 'day' && info.isToday)
                      ? [
                          'first:-ms-1 last:-me-1 size-7 rounded-full font-semibold flex flex-row items-center justify-center bg-chart-1/50',
                          info.hasNavLink && 'group-hover:bg-chart-1/60 group-focus-visible:outline-3 outline-ring/50',
                        ]
                      : 'text-muted-foreground',
                  )}
                >{textPart.value}</span>
              ))}
            </>
          )
        )}

        /* Day Cell
        ----------------------------------------------------------------------------------------- */

        dayCellClass={(info) => cn(
          'border',
          info.isMajor && 'border-foreground/20',
        )}
        dayCellTopClass={(info) => cn(
          info.isNarrow ? 'min-h-0.5' : 'min-h-1',
          'flex flex-row justify-end',
        )}
        dayCellTopInnerClass={(info) => cn(
          'flex flex-row items-center',
          info.isNarrow
            ? `my-px h-5 ${xxsTextClass}`
            : 'my-1 h-6 text-sm',
          !info.isToday
            ? [
                'rounded-s-sm whitespace-nowrap',
                !info.isOther && 'font-semibold',
                info.isNarrow ? 'px-1' : 'px-2',
                !info.monthText && 'text-muted-foreground',
                info.hasNavLink && 'hover:bg-foreground/5',
              ]
            : [
                'group outline-none',
                info.isNarrow
                  ? 'mx-px'
                  : 'mx-2',
              ]
        )}
        dayCellTopContent={(info) => (
          !info.isToday ? (
            <>{info.text}</>
          ) : (
            <>
              {info.textParts.map((textPart, i) => (
                <span
                  key={i}
                  className={cn(
                    'whitespace-pre',
                    (textPart.type === 'day' && info.isToday)
                      ? [
                          'rounded-full font-semibold flex flex-row items-center justify-center bg-chart-1/50',
                          info.hasNavLink && 'group-hover:bg-chart-1/60 group-focus-visible:outline-3 outline-ring/50',
                          info.isNarrow
                            ? 'size-5'
                            : 'size-6 first:-ms-1 last:-me-1',
                        ]
                      : (!info.monthText && 'text-muted-foreground'),
                  )}
                >{textPart.value}</span>
              ))}
            </>
          )
        )}
        dayCellInnerClass={(info) => cn(info.inPopover && 'p-2')}

        /* Popover
        ----------------------------------------------------------------------------------------- */

        popoverClass='border rounded-md overflow-hidden shadow-lg m-1 bg-popover text-popover-foreground min-w-55'
        popoverCloseClass="group absolute top-1.5 end-1.5 p-0.5 rounded-sm hover:bg-foreground/5 focus-visible:outline-3 outline-ring/50"

        /* Lane
        ----------------------------------------------------------------------------------------- */

        dayLaneClass={(info) => cn(
          'border',
          info.isMajor && 'border-foreground/20',
          info.isDisabled && 'bg-foreground/3',
        )}
        dayLaneInnerClass={(info) => (
          info.isStack
            ? 'm-1'
            : info.isNarrow ? 'mx-px' : 'mx-0.5'
        )}
        slotLaneClass={(info) => cn(
          'border',
          info.isMinor && 'border-dotted',
        )}

        /* List Day
        ----------------------------------------------------------------------------------------- */

        listDayClass={(info) => cn(
          'flex flex-col',
          !info.isLast && 'border-b',
        )}
        listDayHeaderClass="-mb-px border-b bg-[color-mix(in_oklab,var(--foreground)_3%,var(--background))] flex flex-row items-center justify-between"
        listDayHeaderInnerClass={(info) => cn(
          'm-1.5 px-1.5 py-0.5 rounded-sm text-sm',
          !info.level && 'font-semibold',
          (!info.level && info.isToday)
            ? [
                'bg-chart-1/50',
                info.hasNavLink && 'hover:bg-chart-1/60 focus-visible:outline-3 outline-ring/50',
              ]
            : info.hasNavLink && 'hover:bg-foreground/5',
        )}
        listDayBodyClass='mt-px px-1.5 py-2 gap-2'

        /* Single Month (in Multi-Month)
        ----------------------------------------------------------------------------------------- */

        singleMonthClass={(info) => cn(
          info.multiMonthColumns > 1 && 'm-3',
          (info.multiMonthColumns === 1 && !info.isLast) && 'border-b',
        )}
        singleMonthHeaderClass={(info) => cn(
          info.multiMonthColumns > 1 ? 'pb-2' : 'py-1 border-b bg-background',
          'items-center',
        )}
        singleMonthHeaderInnerClass={(info) => cn(
          'px-1.5 py-0.5 rounded-sm text-base font-semibold',
          info.hasNavLink && 'hover:bg-foreground/5',
        )}

        /* Misc Table
        ----------------------------------------------------------------------------------------- */

        tableBodyClass='bg-background'
        fillerClass='border opacity-50'
        dayNarrowWidth={100}
        dayHeaderRowClass='border'
        dayRowClass='border'
        slotHeaderRowClass='border'
        slotHeaderInnerClass='text-muted-foreground'

        /* Misc Content
        ----------------------------------------------------------------------------------------- */

        navLinkClass="focus-visible:outline-3 outline-ring/50"
        inlineWeekNumberClass={(info) => cn(
          'absolute start-0 whitespace-nowrap rounded-e-sm text-muted-foreground',
          info.isNarrow
            ? `top-0.5 my-px p-0.5 ${xxsTextClass}`
            : 'top-1 p-1 text-xs',
          info.hasNavLink && 'hover:bg-foreground/5',
        )}
        highlightClass='bg-chart-1/20'
        nonBusinessHoursClass='bg-foreground/3'
        nowIndicatorLineClass='-m-px border-1 border-destructive'
        nowIndicatorDotClass="-m-[6px] border-6 border-destructive size-0 rounded-full ring-2 ring-background"

        /* View-Specific Options
        ----------------------------------------------------------------------------------------- */

        views={{
          ...userViews,
          dayGrid: {
            ...dayRowCommonClasses,
            tableHeaderClass: 'bg-background',
            dayHeaderAlign: (info) => info.inPopover ? 'start' : info.isNarrow ? 'center' : 'end',
            dayHeaderDividerClass: 'border-b',
            dayCellBottomClass: getShortDayCellBottomClass,
            ...userViews?.dayGrid,
          },
          multiMonth: {
            ...dayRowCommonClasses,
            className: 'bg-foreground/3',
            tableHeaderClass: (info) => cn(info.multiMonthColumns === 1 && 'bg-background'),
            dayHeaderAlign: (info) => info.inPopover ? 'start' : info.isNarrow ? 'center' : 'end',
            dayHeaderDividerClass: (info) => cn(info.multiMonthColumns === 1 && 'border-b'),
            dayCellBottomClass: getShortDayCellBottomClass,
            tableBodyClass: (info) => cn(info.multiMonthColumns > 1 && 'border rounded-sm overflow-hidden'),
            ...userViews?.multiMonth,
          },
          timeGrid: {
            ...dayRowCommonClasses,
            tableHeaderClass: 'bg-background',
            dayHeaderAlign: (info) => info.inPopover ? 'start' : 'center',
            dayHeaderDividerClass: (info) => cn(
              'border-b',
              !info.options.allDaySlot && 'border-foreground/20 not-print:shadow-sm',
            ),
            dayCellBottomClass: tallDayCellBottomClass,

            /* TimeGrid > Week Number Header
            ------------------------------------------------------------------------------------- */

            weekNumberHeaderClass: 'items-center justify-end',
            weekNumberHeaderInnerClass: (info) => cn(
              'mx-0.5 h-6 px-1.5 text-muted-foreground flex flex-row items-center rounded-sm',
              info.isNarrow ? 'text-xs' : 'text-sm',
              info.hasNavLink && 'hover:bg-foreground/5',
            ),

            /* TimeGrid > All-Day Header
            ------------------------------------------------------------------------------------- */

            allDayHeaderClass: 'items-center',
            allDayHeaderInnerClass: (info) => cn(
              'm-2 text-muted-foreground',
              info.isNarrow ? xxsTextClass : 'text-xs',
            ),
            allDayDividerClass: 'border-b border-foreground/20 not-print:shadow-sm',

            /* TimeGrid > Slot Header
            ------------------------------------------------------------------------------------- */

            slotHeaderClass: 'justify-end',
            slotHeaderInnerClass: (info) => cn(
              'relative m-2',
              info.isNarrow
                ? `-top-3.5 ${xxsTextClass}`
                : '-top-4 text-xs',
              info.isFirst && 'hidden',
            ),
            slotHeaderDividerClass: 'border-e',

            ...userViews?.timeGrid,
          },
          list: {

            /* List-View > List-Item Event
            ------------------------------------------------------------------------------------- */

            listItemEventClass: (info) => cn(
              'group py-1 rounded-sm hover:bg-muted/50',
              info.isInteractive && 'focus-visible:bg-muted/50 -outline-offset-3',
            ),
            listItemEventBeforeClass: 'w-1.5 bg-(--fc-event-color) rounded-full',
            listItemEventInnerClass: '[display:contents]',
            listItemEventTimeClass: "-order-1 shrink-0 w-1/2 max-w-60 px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-sm",
            listItemEventTitleClass: (info) => cn(
              'grow min-w-0 px-4 py-2 whitespace-nowrap overflow-hidden text-sm',
              info.event.url && 'group-hover:underline',
            ),

            /* No-Events Screen
            ------------------------------------------------------------------------------------- */

            noEventsClass: 'grow flex flex-col items-center justify-center',
            noEventsInnerClass: 'py-15 text-muted-foreground',

            ...userViews?.list,
          },
        }}

      {...restOptions}
    />
  )
}
