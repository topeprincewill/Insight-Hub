import BoxHeader from '@/components/BoxHeader';
import DashBoardBox from '@/components/DashBoardBox';
import { useGetKpisQuery } from '@/state/api';
import { useTheme } from '@mui/material';
import { useMemo }from 'react';
import { ResponsiveContainer, AreaChart, BarChart, Bar, LineChart, XAxis, YAxis, Line, Legend, Tooltip, Area, CartesianGrid } from "recharts";



const Row1 = () => {
  const { palette } = useTheme();
  const { data } = useGetKpisQuery();


  const revenue = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue}) => {
        return {
          name: month.substring(0,3),
          revenue: revenue
        }
      })
    );
  }, [data]);


  //console.log("data:", data)
  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0,3),
          revenue: revenue,
          expenses: expenses,
        }
      })
    );
  }, [data]);

  const revenueProfit = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        
        const profit = (revenue - expenses).toFixed(2);
        const profitMargin = ((profit / revenue) * 100).toFixed(2);
        return {
          name: month.substring(0,3),
          revenue: revenue,
          profit: profit,
          profitMargin: profitMargin,
          };
      })
    );
  }, [data]);

  const trend = useMemo(() => {
    if (!revenueProfit) return '';
    
    const initialMonth = revenueProfit[0];
    const lastMonth = revenueProfit[revenueProfit.length - 1];

    if (parseFloat(lastMonth.profitMargin) > parseFloat(initialMonth.profitMargin)) {
        return "Profit margin has improved";
    } else {
        return "Profit margin has decreased";
    }
}, [revenueProfit]);


const avgRevenueGrowthRate = useMemo(() => {
  if (!revenue || revenue.length < 2) return 0;

  let totalGrowthRate = 0;
  let count = 0;

  for (let i = 1; i < revenue.length; i++) {
    const prevRevenue = revenue[i - 1].revenue;
    const currentRevenue = revenue[i].revenue;

    // Avoid division by zero
    if (prevRevenue !== 0) {
      const growthRate = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
      totalGrowthRate += growthRate;
      count++;
    }
  }

  // Calculate the average growth rate
  const averageGrowthRate = totalGrowthRate / count;
  return averageGrowthRate.toFixed(2); // Keep two decimal points
}, [revenue]);


  return (
    <>
    <DashBoardBox  gridArea="a">
    <BoxHeader
       title="Revenue and Expenses"
       subtitle="top line represents revenue, bottom line represents expenses"
       sideText={`Avg Profit Margin: ${revenueProfit && (revenueProfit.reduce((acc, curr) => acc + parseFloat(curr.profitMargin), 0) / revenueProfit.length).toFixed(2)}%`}
       /> 
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={revenueExpenses}
          margin={{
            top: 15,
            right: 25,
            left: -10,
            bottom: 60,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop 
              offset="5%"  
              stopColor={palette.primary[300]} 
              stopOpacity={0.5} 
              />
              <stop 
              offset="95%"  
              stopColor={palette.primary[300]} 
              stopOpacity={0} 
              />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop 
              offset="5%"  
              stopColor={palette.primary[300]} 
              stopOpacity={0.5} /
              >
              <stop 
              offset="95%"  
              stopColor={palette.primary[300]} 
              stopOpacity={0} 
              />
            </linearGradient>
          </defs>
        
          <XAxis 
          dataKey="name" 
          tickLine={false} 
          style={{ fontSize:"10px" }} 
          />
          <YAxis
          tickLine={false} 
          axisLine={{ strokeWidth: "0"}}
          style={{ fontSize:"10px" }}
          domain={[8000, 23000]}
          />
          <Tooltip />
          <Area 
          type="monotone" 
          dataKey="revenue"
          dot={true} 
          stroke={palette.primary.main}
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
          />
          <Area 
          type="monotone" 
          dataKey="expenses" 
          dot={true}
          stroke={palette.primary.main}
          fillOpacity={1} 
          fill="url(#colorExpenses)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </DashBoardBox>
    <DashBoardBox  gridArea="b">
    <BoxHeader
       title="Profit and Revenue"
       subtitle="top line represents revenue, bottom line represents expenses"
       sideText={trend}
       /> 
    <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={400}
          data={revenueProfit}
          margin={{
            top:20,
            right: 0,
            left: -10,
            bottom: 55,
          }}
        >
          <CartesianGrid vertical={ false } stroke={palette.grey[800]} />
          <XAxis 
          dataKey="name" 
          tickLine={false} 
          style={{ fontSize:"10px" }} 
          />
          <YAxis 
          yAxisId="left"
          tickLine={false} 
          axisLine={false}
          style={{ fontSize:"10px" }}
          />
           <YAxis 
          yAxisId="right"
          orientation="right"
          tickLine={false} 
          axisLine={false}
          style={{ fontSize:"10px" }}
          />
          <Tooltip />
          <Legend 
          height={20} 
          wrapperStyle={{
            margin: '0 0 10px 0' 
          }} 
          />
          <Line
          yAxisId="left"
          type="monotone"
          dataKey="profit"
          stroke={palette.tertiary[500]} 
          />
          <Line 
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          stroke={palette.primary.main} 
          />
        </LineChart>
      </ResponsiveContainer>
    </DashBoardBox>
    <DashBoardBox  gridArea="c">
    <BoxHeader
       title="Revenue Month by Month"
       subtitle="graph representing the revenue month by month"
       sideText={`Avg Growth Rate: ${avgRevenueGrowthRate}%`}
       /> 
    <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={revenue}
          margin={{
            top: 17,
            right: 15,
            left: -5,
            bottom: 58,
          }}
        >
          <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop 
              offset="5%"  
              stopColor={palette.primary[300]} 
              stopOpacity={0.8} 
              />
              <stop 
              offset="95%"  
              stopColor={palette.primary[300]} 
              stopOpacity={0} 
              />
            </linearGradient>
            </defs>
          <CartesianGrid vertical={false} stroke={palette.grey[800]} />
          <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          style={{ fontSize: "10px" }}
          />
          <YAxis 
          axisLine={false} 
          tickLine={false} 
          style={{ fontSize: "10px"}}
          />
          <Tooltip />
          <Bar dataKey="revenue" fill="url(#colorRevenue)" />
        </BarChart>
      </ResponsiveContainer> 
   </DashBoardBox>
    </>
  );
};

export default Row1