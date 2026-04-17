"use client";

import { addHours, endOfToday, format, parseISO, subHours } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartValues = [
  { newCustomers: 23840, activeAccounts: 6630, returningUsers: 4880 },
  { newCustomers: 11508, activeAccounts: 6468, returningUsers: 4643 },
  { newCustomers: 9975, activeAccounts: 6117, returningUsers: 4573 },
  { newCustomers: 10310, activeAccounts: 6152, returningUsers: 4657 },
  { newCustomers: 12244, activeAccounts: 6473, returningUsers: 4657 },
  { newCustomers: 11476, activeAccounts: 6347, returningUsers: 4533 },
  { newCustomers: 9944, activeAccounts: 6250, returningUsers: 4588 },
  { newCustomers: 10259, activeAccounts: 6417, returningUsers: 4763 },
  { newCustomers: 9698, activeAccounts: 6256, returningUsers: 4710 },
  { newCustomers: 8435, activeAccounts: 6161, returningUsers: 4544 },
  { newCustomers: 8885, activeAccounts: 6510, returningUsers: 4595 },
  { newCustomers: 13596, activeAccounts: 6497, returningUsers: 4712 },
  { newCustomers: 6198, activeAccounts: 6165, returningUsers: 4654 },
  { newCustomers: 6546, activeAccounts: 6295, returningUsers: 4622 },
  { newCustomers: 8306, activeAccounts: 6444, returningUsers: 4732 },
  { newCustomers: 7445, activeAccounts: 6283, returningUsers: 4711 },
  { newCustomers: 6646, activeAccounts: 6409, returningUsers: 4551 },
  { newCustomers: 8146, activeAccounts: 6520, returningUsers: 4593 },
  { newCustomers: 8754, activeAccounts: 6197, returningUsers: 4776 },
  { newCustomers: 8715, activeAccounts: 6205, returningUsers: 4745 },
  { newCustomers: 10154, activeAccounts: 6557, returningUsers: 4600 },
  { newCustomers: 10337, activeAccounts: 6438, returningUsers: 4641 },
  { newCustomers: 14212, activeAccounts: 6251, returningUsers: 4715 },
  { newCustomers: 18873, activeAccounts: 6557, returningUsers: 4633 },
  { newCustomers: 11558, activeAccounts: 6338, returningUsers: 4626 },
  { newCustomers: 9951, activeAccounts: 6218, returningUsers: 4769 },
  { newCustomers: 8716, activeAccounts: 6518, returningUsers: 4749 },
  { newCustomers: 9690, activeAccounts: 6520, returningUsers: 4565 },
  { newCustomers: 9423, activeAccounts: 6157, returningUsers: 4581 },
  { newCustomers: 8563, activeAccounts: 6268, returningUsers: 4839 },
  { newCustomers: 9255, activeAccounts: 6489, returningUsers: 4730 },
  { newCustomers: 22106, activeAccounts: 6317, returningUsers: 4619 },
  { newCustomers: 7765, activeAccounts: 6346, returningUsers: 4670 },
  { newCustomers: 14487, activeAccounts: 6470, returningUsers: 4708 },
  { newCustomers: 10830, activeAccounts: 6194, returningUsers: 4589 },
  { newCustomers: 9486, activeAccounts: 6172, returningUsers: 4584 },
  { newCustomers: 9200, activeAccounts: 6529, returningUsers: 4754 },
  { newCustomers: 11020, activeAccounts: 6417, returningUsers: 4751 },
  { newCustomers: 11085, activeAccounts: 6153, returningUsers: 4565 },
  { newCustomers: 10372, activeAccounts: 6317, returningUsers: 4558 },
  { newCustomers: 10936, activeAccounts: 6323, returningUsers: 4692 },
  { newCustomers: 10196, activeAccounts: 6436, returningUsers: 4665 },
  { newCustomers: 8744, activeAccounts: 6407, returningUsers: 4589 },
  { newCustomers: 9592, activeAccounts: 6429, returningUsers: 4670 },
  { newCustomers: 14952, activeAccounts: 6061, returningUsers: 4691 },
  { newCustomers: 7242, activeAccounts: 6150, returningUsers: 4532 },
  { newCustomers: 15297, activeAccounts: 6568, returningUsers: 4511 },
  { newCustomers: 7844, activeAccounts: 6248, returningUsers: 4870 },
  { newCustomers: 7336, activeAccounts: 6181, returningUsers: 4708 },
  { newCustomers: 6548, activeAccounts: 6322, returningUsers: 4542 },
  { newCustomers: 7496, activeAccounts: 6112, returningUsers: 4530 },
  { newCustomers: 7529, activeAccounts: 6059, returningUsers: 4625 },
  { newCustomers: 7369, activeAccounts: 6401, returningUsers: 4570 },
  { newCustomers: 9434, activeAccounts: 6303, returningUsers: 4514 },
  { newCustomers: 10387, activeAccounts: 5984, returningUsers: 4633 },
  { newCustomers: 14173, activeAccounts: 6146, returningUsers: 4660 },
  { newCustomers: 9635, activeAccounts: 6239, returningUsers: 4478 },
  { newCustomers: 11690, activeAccounts: 6070, returningUsers: 4431 },
  { newCustomers: 11148, activeAccounts: 6221, returningUsers: 4688 },
  { newCustomers: 10205, activeAccounts: 6270, returningUsers: 4626 },
  { newCustomers: 10773, activeAccounts: 5926, returningUsers: 4494 },
  { newCustomers: 10134, activeAccounts: 5995, returningUsers: 4500 },
  { newCustomers: 22444, activeAccounts: 6315, returningUsers: 4566 },
  { newCustomers: 10213, activeAccounts: 6134, returningUsers: 4472 },
  { newCustomers: 9788, activeAccounts: 5983, returningUsers: 4416 },
  { newCustomers: 7646, activeAccounts: 6146, returningUsers: 4566 },
  { newCustomers: 13396, activeAccounts: 6020, returningUsers: 4615 },
  { newCustomers: 9889, activeAccounts: 5938, returningUsers: 4434 },
  { newCustomers: 8999, activeAccounts: 6246, returningUsers: 4370 },
  { newCustomers: 17176, activeAccounts: 6314, returningUsers: 4508 },
  { newCustomers: 9602, activeAccounts: 5827, returningUsers: 4527 },
  { newCustomers: 9663, activeAccounts: 5992, returningUsers: 4428 },
  { newCustomers: 9542, activeAccounts: 6167, returningUsers: 4471 },
  { newCustomers: 10921, activeAccounts: 5981, returningUsers: 4530 },
  { newCustomers: 10557, activeAccounts: 6051, returningUsers: 4398 },
  { newCustomers: 8774, activeAccounts: 6138, returningUsers: 4326 },
  { newCustomers: 9607, activeAccounts: 5843, returningUsers: 4489 },
  { newCustomers: 15883, activeAccounts: 5891, returningUsers: 4563 },
  { newCustomers: 8805, activeAccounts: 6235, returningUsers: 4404 },
  { newCustomers: 7551, activeAccounts: 6065, returningUsers: 4342 },
  { newCustomers: 8177, activeAccounts: 5847, returningUsers: 4449 },
  { newCustomers: 7534, activeAccounts: 6037, returningUsers: 4440 },
  { newCustomers: 6902, activeAccounts: 6264, returningUsers: 4360 },
  { newCustomers: 7832, activeAccounts: 5895, returningUsers: 4446 },
  { newCustomers: 7311, activeAccounts: 6155, returningUsers: 4520 },
  { newCustomers: 6245, activeAccounts: 6119, returningUsers: 4369 },
  { newCustomers: 8128, activeAccounts: 5772, returningUsers: 4274 },
  { newCustomers: 9848, activeAccounts: 5936, returningUsers: 4518 },
  { newCustomers: 13995, activeAccounts: 6184, returningUsers: 4515 },
  { newCustomers: 8963, activeAccounts: 5986, returningUsers: 4390 },
  { newCustomers: 10872, activeAccounts: 5976, returningUsers: 4353 },
  { newCustomers: 11036, activeAccounts: 6106, returningUsers: 4440 },
  { newCustomers: 19721, activeAccounts: 6023, returningUsers: 4393 },
  { newCustomers: 25079, activeAccounts: 5905, returningUsers: 4310 },
  { newCustomers: 11054, activeAccounts: 6252, returningUsers: 4611 },
  { newCustomers: 9769, activeAccounts: 6101, returningUsers: 4534 },
  { newCustomers: 10977, activeAccounts: 5835, returningUsers: 4386 },
  { newCustomers: 11193, activeAccounts: 6048, returningUsers: 4276 },
  { newCustomers: 8766, activeAccounts: 6109, returningUsers: 4408 },
  { newCustomers: 13370, activeAccounts: 5970, returningUsers: 4485 },
  { newCustomers: 9279, activeAccounts: 6168, returningUsers: 4390 },
  { newCustomers: 8581, activeAccounts: 6176, returningUsers: 4395 },
  { newCustomers: 8002, activeAccounts: 5852, returningUsers: 4484 },
  { newCustomers: 8811, activeAccounts: 6005, returningUsers: 4401 },
  { newCustomers: 8261, activeAccounts: 6306, returningUsers: 4298 },
  { newCustomers: 7857, activeAccounts: 6100, returningUsers: 4434 },
  { newCustomers: 9836, activeAccounts: 6013, returningUsers: 4564 },
  { newCustomers: 10372, activeAccounts: 6187, returningUsers: 4438 },
  { newCustomers: 8604, activeAccounts: 6043, returningUsers: 4334 },
  { newCustomers: 9027, activeAccounts: 6029, returningUsers: 4439 },
  { newCustomers: 15778, activeAccounts: 6355, returningUsers: 4486 },
  { newCustomers: 9732, activeAccounts: 6230, returningUsers: 4404 },
  { newCustomers: 8909, activeAccounts: 5932, returningUsers: 4454 },
  { newCustomers: 9279, activeAccounts: 6160, returningUsers: 4564 },
  { newCustomers: 8207, activeAccounts: 6302, returningUsers: 4462 },
  { newCustomers: 16222, activeAccounts: 6269, returningUsers: 4333 },
  { newCustomers: 8695, activeAccounts: 6251, returningUsers: 4550 },
  { newCustomers: 8282, activeAccounts: 6307, returningUsers: 4601 },
  { newCustomers: 6307, activeAccounts: 6020, returningUsers: 4506 },
  { newCustomers: 7191, activeAccounts: 6149, returningUsers: 4427 },
  { newCustomers: 9014, activeAccounts: 6475, returningUsers: 4518 },
  { newCustomers: 13671, activeAccounts: 6264, returningUsers: 4525 },
  { newCustomers: 8484, activeAccounts: 6106, returningUsers: 4432 },
  { newCustomers: 9909, activeAccounts: 6576, returningUsers: 4514 },
  { newCustomers: 23158, activeAccounts: 6252, returningUsers: 4654 },
  { newCustomers: 10314, activeAccounts: 6190, returningUsers: 4554 },
  { newCustomers: 12158, activeAccounts: 6470, returningUsers: 4409 },
  { newCustomers: 11810, activeAccounts: 6376, returningUsers: 4512 },
  { newCustomers: 10126, activeAccounts: 6062, returningUsers: 4640 },
  { newCustomers: 11137, activeAccounts: 6289, returningUsers: 4566 },
  { newCustomers: 12120, activeAccounts: 6494, returningUsers: 4528 },
  { newCustomers: 10293, activeAccounts: 6283, returningUsers: 4624 },
  { newCustomers: 14431, activeAccounts: 6321, returningUsers: 4593 },
  { newCustomers: 9549, activeAccounts: 6423, returningUsers: 4472 },
  { newCustomers: 8487, activeAccounts: 6186, returningUsers: 4563 },
  { newCustomers: 7935, activeAccounts: 6272, returningUsers: 4730 },
  { newCustomers: 8825, activeAccounts: 6598, returningUsers: 4648 },
  { newCustomers: 7814, activeAccounts: 6386, returningUsers: 4505 },
  { newCustomers: 15233, activeAccounts: 6306, returningUsers: 4583 },
  { newCustomers: 8133, activeAccounts: 6403, returningUsers: 4676 },
  { newCustomers: 9451, activeAccounts: 6413, returningUsers: 4604 },
  { newCustomers: 8181, activeAccounts: 6294, returningUsers: 4786 },
  { newCustomers: 8262, activeAccounts: 6508, returningUsers: 4725 },
  { newCustomers: 14874, activeAccounts: 6452, returningUsers: 4673 },
  { newCustomers: 9428, activeAccounts: 6139, returningUsers: 4520 },
  { newCustomers: 9471, activeAccounts: 6348, returningUsers: 4687 },
  { newCustomers: 10439, activeAccounts: 6594, returningUsers: 4771 },
  { newCustomers: 9282, activeAccounts: 6348, returningUsers: 4712 },
  { newCustomers: 8014, activeAccounts: 6303, returningUsers: 4592 },
  { newCustomers: 9456, activeAccounts: 6451, returningUsers: 4658 },
  { newCustomers: 9750, activeAccounts: 6270, returningUsers: 4707 },
  { newCustomers: 7623, activeAccounts: 6301, returningUsers: 4614 },
  { newCustomers: 7441, activeAccounts: 6602, returningUsers: 4641 },
  { newCustomers: 8613, activeAccounts: 6402, returningUsers: 4792 },
  { newCustomers: 13354, activeAccounts: 6136, returningUsers: 4740 },
  { newCustomers: 21487, activeAccounts: 6389, returningUsers: 4564 },
  { newCustomers: 9481, activeAccounts: 6465, returningUsers: 4616 },
  { newCustomers: 8932, activeAccounts: 6287, returningUsers: 4772 },
  { newCustomers: 8855, activeAccounts: 6427, returningUsers: 4727 },
  { newCustomers: 11234, activeAccounts: 6417, returningUsers: 4642 },
  { newCustomers: 11850, activeAccounts: 6123, returningUsers: 4717 },
  { newCustomers: 19042, activeAccounts: 6441, returningUsers: 4728 },
  { newCustomers: 10788, activeAccounts: 6571, returningUsers: 4599 },
  { newCustomers: 12062, activeAccounts: 6301, returningUsers: 4630 },
  { newCustomers: 11104, activeAccounts: 6442, returningUsers: 4805 },
  { newCustomers: 15697, activeAccounts: 6375, returningUsers: 4769 },
  { newCustomers: 10622, activeAccounts: 6259, returningUsers: 4593 },
  { newCustomers: 8993, activeAccounts: 6227, returningUsers: 4621 },
  { newCustomers: 8066, activeAccounts: 6490, returningUsers: 4741 },
  { newCustomers: 9249, activeAccounts: 6317, returningUsers: 4690 },
  { newCustomers: 8439, activeAccounts: 6027, returningUsers: 4640 },
  { newCustomers: 6207, activeAccounts: 6287, returningUsers: 4742 },
  { newCustomers: 6868, activeAccounts: 6422, returningUsers: 4734 },
  { newCustomers: 8206, activeAccounts: 6190, returningUsers: 4568 },
  { newCustomers: 7467, activeAccounts: 6256, returningUsers: 4673 },
  { newCustomers: 7595, activeAccounts: 6306, returningUsers: 4764 },
  { newCustomers: 13895, activeAccounts: 6050, returningUsers: 4749 },
  { newCustomers: 8293, activeAccounts: 6186, returningUsers: 4595 },
  { newCustomers: 8744, activeAccounts: 6464, returningUsers: 4615 },
  { newCustomers: 10727, activeAccounts: 6189, returningUsers: 4693 },
];

const endDate = endOfToday();
const startDate = subHours(endDate, (chartValues.length - 1) * 12);

const chartData = chartValues.map((point, index) => ({
  date: format(addHours(startDate, index * 12), "yyyy-MM-dd"),
  ...point,
}));

const chartConfig = {
  newCustomers: {
    label: "New Customers",
    color: "var(--chart-1)",
  },
  activeAccounts: {
    label: "Active Accounts",
    color: "var(--chart-2)",
  },
  returningUsers: {
    label: "Returning Users",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function PerformanceOverview() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="leading-none">Customer Activity</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Customer activity for the last 3 months</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="quarter">
            <SelectTrigger size="sm" className="w-28">
              <SelectValue placeholder="3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Period</SelectLabel>
                <SelectItem value="quarter">3 months</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="All segments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Segments</SelectLabel>
                <SelectItem value="all">All segments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            View report
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <ComposedChart data={chartData} margin={{ top: 0 }}>
            <defs>
              <linearGradient id="fillNewCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newCustomers)" stopOpacity={0.36} />
                <stop offset="95%" stopColor="var(--color-newCustomers)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={48}
              tickFormatter={(value) =>
                parseISO(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-50"
                  indicator="line"
                  labelFormatter={(value) => format(parseISO(value), "d MMMM yyyy")}
                />
              }
            />
            <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-5 justify-end" />} />

            <Area
              dataKey="newCustomers"
              type="natural"
              fill="url(#fillNewCustomers)"
              stroke="var(--color-newCustomers)"
              strokeWidth={1.25}
              dot={false}
              fillOpacity={1}
            />
            <Line
              dataKey="activeAccounts"
              type="natural"
              stroke="var(--color-activeAccounts)"
              strokeWidth={1.4}
              dot={false}
            />
            <Line
              dataKey="returningUsers"
              type="natural"
              stroke="var(--color-returningUsers)"
              strokeWidth={1.2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
