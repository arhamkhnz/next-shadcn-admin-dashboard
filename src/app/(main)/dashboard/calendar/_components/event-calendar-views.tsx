import React from 'react'
import FullCalendar, { type CalendarOptions, type DayCellInfo, type DayHeaderInfo } from '@fullcalendar/react'
import '@fullcalendar/react/skeleton.css'
import { cn } from '@/lib/utils'

const xxsTextClass = 'text-[0.6875rem]/[1.090909]'

const blockPointerResizerClass = 'absolute hidden group-hover:block'
const rowPointerResizerClass = `${blockPointerResizerClass} inset-y-0 w-2`
const columnPointerResizerClass = `${blockPointerResizerClass} inset-x-0 h-2`

const blockTouchResizerClass = 'absolute size-2 border border-(--fc-event-color) bg-background rounded-full'
const rowTouchResizerClass = `${blockTouchResizerClass} top-1/2 -mt-1`
const columnTouchResizerClass = `${blockTouchResizerClass} left-1/2 -ml-1`

const getNormalDayHeaderBorderClass = (info: DayHeaderInfo) => cn(
  !info.inPopover && (
    info.isMajor ? 'border border-foreground/20' :
      !info.isNarrow && 'border'
  )
)
const getMutedDayHeaderBorderClass = (info: DayHeaderInfo) => cn(
  !info.inPopover && (
    info.isMajor ? 'border border-foreground/20' :
      !info.isNarrow && 'border'
  )
)

const getNormalDayCellBorderColorClass = (info: DayCellInfo) => cn(
  info.isMajor && 'border-foreground/20'
)
const getMutedDayCellBorderColorClass = (info: DayCellInfo) => cn(
  info.isMajor && 'border-foreground/20'
)

const tallDayCellBottomClass = 'min-h-3'
const getShortDayCellBottomClass = (info: DayCellInfo) => cn(
  !info.isNarrow && 'min-h-px'
)

const mutedHoverButtonClass = 'hover:bg-foreground/5 focus-visible:outline-3 outline-ring/50'

const dayRowCommonClasses: CalendarOptions = {

  /* Day Row > List-Item Event
  ----------------------------------------------------------------------------------------------- */

  listItemEventClass: (info) => cn(
    'mb-px p-px',
    info.isNarrow
      ? 'mx-px rounded-sm'
      : 'mx-1 rounded-md',
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
    'text-muted-foreground order-1 whitespace-nowrap overflow-hidden shrink-1',
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
  rowEventInnerClass: (info) => info.isNarrow ? 'py-px' : 'py-0.5',

  /* Day Row > More-Link
  ----------------------------------------------------------------------------------------------- */

  rowMoreLinkClass: (info) => cn(
    'mb-px border',
    info.isNarrow
      ? 'mx-px border-primary rounded-sm'
      : 'self-start mx-1 border-transparent rounded-md',
    'hover:bg-foreground/5',
  ),
  rowMoreLinkInnerClass: (info) =>
    info.isNarrow
      ? `p-px ${xxsTextClass}`
      : 'p-0.5 text-xs'
}

export type EventCalendarViewProps =
  CalendarOptions &
  Required<Pick<CalendarOptions, 'popoverCloseContent'>> // ensure callers define icons

export function EventCalendarViews({
  views: userViews,
  ...restOptions
}: EventCalendarViewProps) {
  return (
    <FullCalendar

      /* Abstract Event
      ----------------------------------------------------------------------------------------- */

      eventShortHeight={50}
      eventColor="var(--chart-2)"
      eventContrastColor="var(--primary-foreground)"
      eventClass={(info) => cn(
        info.isSelected
          ? [
              'outline-3',
              info.isDragging && 'shadow-md',
            ]
          : 'focus-visible:outline-3',
        'outline-ring/50',
      )}

      /* Background Event
      ----------------------------------------------------------------------------------------- */

      backgroundEventColor="var(--chart-3)"
      backgroundEventClass="not-print:bg-[color-mix(in_oklab,var(--fc-event-color)_10%,transparent)] print:border-1 print:border-(--fc-event-color)"
      backgroundEventTitleClass={(info) => cn(
        'opacity-50 italic',
        info.isNarrow
          ? `p-1 ${xxsTextClass}`
          : 'p-2 text-xs',
      )}

      /* Block Event
      ----------------------------------------------------------------------------------------- */

      blockEventClass={(info) => cn(
        'group relative print:bg-white border-transparent print:border-(--fc-event-color) bg-[color-mix(in_oklab,var(--fc-event-color)_25%,var(--background))]',
        info.isInteractive && 'hover:bg-[color-mix(in_oklab,var(--fc-event-color)_30%,var(--background))]',
        (info.isDragging && !info.isSelected) && 'opacity-75',
      )}
      blockEventInnerClass="text-[color-mix(in_oklab,var(--fc-event-color)_50%,var(--foreground))]"
      blockEventTimeClass="whitespace-nowrap overflow-hidden shrink-1"
      blockEventTitleClass="whitespace-nowrap overflow-hidden shrink-100"

      /* Row Event
      ----------------------------------------------------------------------------------------- */

      rowEventClass={(info) => cn(
        'mb-px border-y',
        info.isStart && ['border-s', info.isNarrow ? 'rounded-s-sm' : 'rounded-s-md'],
        info.isEnd && ['border-e', info.isNarrow ? 'rounded-e-sm' : 'rounded-e-md'],
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
        info.isNarrow ? 'ps-0.5' : 'ps-1',
        'font-medium',
      )}
      rowEventTitleClass={(info) => cn(
        info.isNarrow ? 'px-0.5' : 'px-1'
      )}

      /* Column Event
      ----------------------------------------------------------------------------------------- */

      columnEventClass={(info) => cn(
        'border-x ring ring-background',
        info.isStart && ['border-t rounded-t-lg', info.isNarrow ? 'mt-px' : 'mt-1'],
        info.isEnd && ['border-b rounded-b-lg', info.isNarrow ? 'mb-px' : 'mb-1'],
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
        (info.isShort || info.isNarrow) ? xxsTextClass : 'text-xs',
      )}
      columnEventTimeClass={(info) => cn(
        !info.isShort && (info.isNarrow ? 'pt-0.5' : 'pt-1')
      )}
      columnEventTitleClass={(info) => cn(
        !info.isShort && (info.isNarrow ? 'py-0.5' : 'py-1'),
        'font-semibold',
      )}

      /* More-Link
      ----------------------------------------------------------------------------------------- */

      moreLinkClass="focus-visible:outline-3 outline-ring/50"
      moreLinkInnerClass="whitespace-nowrap overflow-hidden"
      columnMoreLinkClass={(info) => cn(
        info.isNarrow ? 'my-px' : 'my-1',
        'border border-transparent print:border-black rounded-md bg-[color-mix(in_oklab,var(--foreground)_10%,var(--background))] hover:bg-[color-mix(in_oklab,var(--foreground)_13%,var(--background))] print:bg-white ring ring-background',
      )}
      columnMoreLinkInnerClass={(info) => cn(
        info.isNarrow
          ? `p-0.5 ${xxsTextClass}`
          : 'p-1 text-xs',
      )}

      /* Day Header
      ----------------------------------------------------------------------------------------- */

      dayHeaderAlign={(info) => info.inPopover ? 'start' : 'center'}
      dayHeaderClass={(info) => cn(
        'justify-center',
        info.inPopover && 'border-b bg-foreground/5',
      )}
      dayHeaderInnerClass={(info) => cn(
        'flex flex-row items-center',
        (!info.dayNumberText && !info.inPopover)
          ? [
              'py-1 rounded-sm text-xs',
              info.isNarrow
                ? 'px-1 m-1 text-muted-foreground'
                : 'px-1.5 m-2 font-semibold',
              info.hasNavLink && mutedHoverButtonClass,
            ]
          : (info.isToday && info.dayNumberText && !info.inPopover)
              ? [
                  'group m-2 outline-none',
                  info.isNarrow ? 'h-6' : 'h-8'
                ]
              : [
                  'rounded-sm',
                  info.inPopover
                    ? 'm-2 px-1 py-0.5'
                    : [
                        'mx-2 h-6 px-1.5',
                        info.isNarrow ? 'my-2' : 'my-3'
                      ],
                  info.hasNavLink && mutedHoverButtonClass,
                ],
      )}
      dayHeaderContent={(info) => (
        (!info.dayNumberText && !info.inPopover) ? (
          <>{info.text}</>
        ) : (
          <>
            {info.textParts.map((textPart, i) => (
              <span
                key={i}
                className={cn(
                  'whitespace-pre',
                  info.isNarrow ? 'text-xs' : 'text-sm',
                  textPart.type === 'day'
                    ? [
                        'flex flex-row items-center',
                        !info.isNarrow && 'font-semibold',
                        (info.isToday && !info.inPopover) && [
                          'mx-0.5 rounded-full justify-center bg-primary text-primary-foreground',
                          info.isNarrow ? 'size-6' : 'size-8',
                          info.hasNavLink && 'group-hover:bg-primary/90 group-focus-visible:outline-3 outline-ring/50',
                        ],
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
        ((info.isOther || info.isDisabled) && !info.options.businessHours) && 'bg-foreground/3',
      )}
      dayCellTopClass={(info) => cn(
        info.isNarrow ? 'min-h-0.5' : 'min-h-1',
        'flex flex-row',
      )}
      dayCellTopInnerClass={(info) => cn(
        'flex flex-row items-center justify-center whitespace-nowrap',
        info.isNarrow
          ? `my-px h-5 ${xxsTextClass}`
          : 'my-1 h-6 text-xs',
        info.isToday
          ? [
              'rounded-full font-semibold',
              info.isNarrow
                ? 'ms-px'
                : 'ms-1',
              info.text === info.dayNumberText
                ? (info.isNarrow ? 'w-5' : 'w-6')
                : (info.isNarrow ? 'px-1' : 'px-2'),
              'bg-primary text-primary-foreground',
              info.hasNavLink && 'hover:bg-primary/90',
            ]
          : [
              'rounded-e-sm',
              info.isNarrow ? 'px-1' : 'px-2',
              info.hasNavLink && 'hover:bg-foreground/5',
              (info.isOther || !info.monthText) && 'text-muted-foreground',
              info.monthText && 'font-bold',
            ],
      )}
      dayCellInnerClass={(info) => cn(info.inPopover && 'p-2')}

      /* Popover
      ----------------------------------------------------------------------------------------- */

      popoverClass="border rounded-md overflow-hidden shadow-lg m-1 bg-popover text-popover-foreground min-w-55"
      popoverCloseClass={`group absolute top-2 end-2 p-0.5 rounded-sm ${mutedHoverButtonClass}`}

      /* Lane
      ----------------------------------------------------------------------------------------- */

      dayLaneClass={(info) => cn(
        'border',
        info.isMajor && 'border-foreground/20',
        info.isDisabled && 'bg-foreground/3',
      )}
      dayLaneInnerClass={(info) => cn(
        info.isStack
          ? 'm-1'
          : info.isNarrow ? 'mx-px' : 'mx-1'
      )}
      slotLaneClass={(info) => cn(
        'border',
        info.isMinor && 'border-dotted',
      )}

      /* List Day
      ----------------------------------------------------------------------------------------- */

      listDaysClass="my-10 mx-auto w-full max-w-218 px-4"
      listDayClass={(info) => cn(
        !info.isLast && 'border-b',
        'flex flex-row items-start gap-2',
      )}
      listDayHeaderClass="my-px shrink-0 w-1/4 max-w-50 py-3.5 flex flex-col items-start"
      listDayHeaderInnerClass={(info) => cn(
        'my-0.5 py-0.5 px-2 -mx-2 rounded-full text-sm',
        !info.level
          ? [
              info.isToday
                ? [
                    'font-semibold bg-primary text-primary-foreground',
                    info.hasNavLink && 'hover:bg-primary/90',
                  ]
                : [
                    'font-medium',
                    info.hasNavLink && 'hover:bg-foreground/5',
                  ]
            ]
          : [
              'text-muted-foreground',
              info.hasNavLink && 'hover:bg-foreground/5 hover:text-muted-foreground',
            ]
      )}
      listDayBodyClass="my-4 grow min-w-0 border rounded-md"

      /* Single Month (in Multi-Month)
      ----------------------------------------------------------------------------------------- */

      singleMonthClass={(info) => cn(
        info.multiMonthColumns > 1 && 'm-4',
        (info.multiMonthColumns === 1 && !info.isLast) && 'border-b',
      )}
      singleMonthHeaderClass={(info) => cn(
        info.multiMonthColumns > 1 ? 'pb-1' : 'py-1.5 bg-background border-b',
        'items-center',
      )}
      singleMonthHeaderInnerClass={(info) => cn(
        'py-1 px-2 rounded-md text-sm font-semibold',
        info.hasNavLink && 'hover:bg-foreground/5',
      )}

      /* Misc Table
      ----------------------------------------------------------------------------------------- */

      fillerClass="border"
      dayNarrowWidth={100}
      dayHeaderRowClass="border"
      dayRowClass="border"
      slotHeaderRowClass="border"
      slotHeaderInnerClass="text-muted-foreground uppercase"
      tableHeaderClass='bg-background'

      /* Misc Content
      ----------------------------------------------------------------------------------------- */

      navLinkClass="focus-visible:outline-3 outline-ring/50"
      inlineWeekNumberClass={(info) => cn(
        'absolute top-0 end-0 bg-background text-muted-foreground whitespace-nowrap rounded-es-md border-b border-b-foreground/20 border-s hover:bg-foreground/5',
        info.isNarrow
          ? `p-0.5 ${xxsTextClass}`
          : 'p-1.5 text-xs',
        info.hasNavLink && '-outline-offset-1',
      )}
      highlightClass="bg-chart-1/15"
      nonBusinessHoursClass="bg-foreground/3"
      nowIndicatorLineClass="-m-px border-1 border-destructive"
      nowIndicatorDotClass="-m-[6px] border-6 border-destructive size-0 rounded-full ring-2 ring-background"

      /* View-Specific Options
      ----------------------------------------------------------------------------------------- */

      views={{
        ...userViews,
        dayGrid: {
          ...dayRowCommonClasses,
          dayHeaderClass: getNormalDayHeaderBorderClass,
          dayHeaderDividerClass: 'border-b border-foreground/20',
          dayCellClass: getNormalDayCellBorderColorClass,
          dayCellBottomClass: getShortDayCellBottomClass,
          backgroundEventInnerClass: 'flex flex-row justify-end',
          ...userViews?.dayGrid,
        },
        multiMonth: {
          ...dayRowCommonClasses,
          dayHeaderClass: getNormalDayHeaderBorderClass,
          dayHeaderDividerClass: (info) => cn(info.multiMonthColumns === 1 && 'border-b border-foreground/20 shadow-sm'),
          dayCellClass: getNormalDayCellBorderColorClass,
          dayCellBottomClass: getShortDayCellBottomClass,
          tableBodyClass: (info) => cn(info.multiMonthColumns > 1 && 'border rounded-md shadow-xs overflow-hidden'),
          ...userViews?.multiMonth,
        },
        timeGrid: {
          ...dayRowCommonClasses,
          dayHeaderClass: getMutedDayHeaderBorderClass,
          dayHeaderDividerClass: (info) => cn(
            'border-b',
            !info.options.allDaySlot && 'border-foreground/20 not-print:shadow-sm',
          ),
          dayCellClass: getMutedDayCellBorderColorClass,
          dayCellBottomClass: tallDayCellBottomClass,

          /* TimeGrid > Week Number Header
          ------------------------------------------------------------------------------------- */

          weekNumberHeaderClass: 'items-center justify-end',
          weekNumberHeaderInnerClass: (info) => cn(
            'm-1.5 h-6 px-1.5 text-muted-foreground rounded-sm flex flex-row items-center',
            info.hasNavLink && 'hover:bg-foreground/5',
            info.isNarrow ? 'text-xs' : 'text-sm',
          ),

          /* TimeGrid > All-Day Header
          ------------------------------------------------------------------------------------- */

          allDayHeaderClass: 'items-center',
          allDayHeaderInnerClass: (info) => cn(
            'm-3 text-muted-foreground',
            info.isNarrow ? xxsTextClass : 'text-xs',
          ),
          allDayDividerClass: 'border-b border-foreground/20 not-print:shadow-sm',

          /* TimeGrid > Slot Header
          ------------------------------------------------------------------------------------- */

          slotHeaderClass: 'justify-end',
          slotHeaderInnerClass: (info) => cn(
            'relative mx-3 my-2',
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
            'group p-4 items-center gap-3 hover:bg-muted/50',
            !info.isLast && 'border-b',
            info.isInteractive && 'focus-visible:bg-muted/50',
          ),
          listItemEventBeforeClass: 'border-4 border-(--fc-event-color) rounded-full',
          listItemEventInnerClass: 'flex flex-row items-center gap-3 text-sm',
          listItemEventTimeClass: 'shrink-0 w-1/2 max-w-50 whitespace-nowrap overflow-hidden text-ellipsis text-muted-foreground',
          listItemEventTitleClass: (info) => cn(
            'grow min-w-0 font-medium whitespace-nowrap overflow-hidden',
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
