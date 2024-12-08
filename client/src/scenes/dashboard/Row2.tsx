import DashBoardBox from '@/components/DashBoardBox';
import { useGetKpisQuery, useGetProductsQuery } from "@/state/api";
import React, { useMemo, useState, useEffect } from 'react';
import BoxHeader from '@/components/BoxHeader';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid, Pie, PieChart, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import FlexBetween from '@/components/FlexBetween';

const pieData = [
  { name: "Group A", value: 600},
  { name: "Group B", value: 100},
]


const Row2 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[300]];
  const { data: operationalData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();

  const [expenseRatio, setExpenseRatio] = useState(null);
  const [correlationCoefficient, setCorrelationCoefficient] = useState(null);
  
  
  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(({ month, operationalExpenses, nonOperationalExpenses }) => {
        const expenseRatio = nonOperationalExpenses !== 0 
          ? (operationalExpenses / nonOperationalExpenses).toFixed(2) 
          : "N/A"; 
        return {
          name: month.substring(0,3),
          "Operational Expenses": operationalExpenses,
          "Non Operational Expenses": nonOperationalExpenses,
          "Expense Ratio": expenseRatio,
        };
      })
    );
  }, [operationalData]);


  const expenseRatioTrend = useMemo(() => {
    if (!operationalData || operationalData.length === 0) {
      return 'No data available';
    }
  
    const totalOperational = operationalData[0].monthlyData.reduce((acc, item) => acc + item.operationalExpenses, 0);
    const totalNonOperational = operationalData[0].monthlyData.reduce((acc, item) => acc + item.nonOperationalExpenses, 0);
  
    if (totalNonOperational === 0) return "Error";
  
    const overallExpenseRatio = (totalOperational / totalNonOperational).toFixed(2);
  
    return `(Ratio: ${overallExpenseRatio})`;
  }, [operationalData]);


  useEffect(() => {
    if (!operationalData || operationalData.length === 0) {
      setExpenseRatio(null); // Reset to null if no data
      return;
    }
  
    const totalOperational = operationalData[0].monthlyData.reduce((acc, item) => acc + item.operationalExpenses, 0);
    const totalNonOperational = operationalData[0].monthlyData.reduce((acc, item) => acc + item.nonOperationalExpenses, 0);
  
    if (totalNonOperational === 0) {
      setExpenseRatio("Error");
      return;
    }
  
    const overallExpenseRatio = (totalOperational / totalNonOperational).toFixed(2);
    setExpenseRatio(overallExpenseRatio); // Store for backend save
  }, [operationalData]);
  


const productExpenseData = useMemo(() => {
    return (
      productData &&
      productData.map(
        ({ _id, price, expense}) => {
        return {
          id: _id,
          price: price,
          expense: expense,
        };
      })
    );
  }, [productData]);


  const correlationTrend = useMemo(() => {
    if (!productExpenseData || productExpenseData.length === 0) {
        return '';
    }
    
    // Step 1: Extract price and expense values from data
    const prices = productExpenseData.map(item => item.price);
    const expenses = productExpenseData.map(item => item.expense);

    // Step 2: Calculate Pearson correlation coefficient
    const calculateCorrelation = (arr1, arr2) => {
        const n = arr1.length;
        const sum1 = arr1.reduce((acc, value) => acc + value, 0);
        const sum2 = arr2.reduce((acc, value) => acc + value, 0);
        const sum1Sq = arr1.reduce((acc, value) => acc + value * value, 0);
        const sum2Sq = arr2.reduce((acc, value) => acc + value * value, 0);
        const pSum = arr1.reduce((acc, value, i) => acc + value * arr2[i], 0);

        // (x1^2 - (x1 * x1/n) ) * (x2^2 - (x2 * x2/n))

        const num = n * pSum - (sum1 * sum2);
        const den = Math.sqrt((n * sum1Sq - sum1 * sum1)) * Math.sqrt((n * sum2Sq - sum2 * sum2));
    
        if (den === 0) return 0;
    
        return num / den;
    };

    const correlationCoefficient = calculateCorrelation(prices, expenses).toFixed(2);

    // Step 3: Determine correlation trend based on the coefficient value
    if (correlationCoefficient > 0) {
        return `Positive correlation (${correlationCoefficient})`;
    } else if (correlationCoefficient < 0) {
        return `Negative correlation (${correlationCoefficient})`;
    } else {
        return `C.C is ${correlationCoefficient}. No correlation.`;
    }
}, [productExpenseData]);




// Compute and update Correlation Coefficient
useEffect(() => {
  if (productExpenseData && productExpenseData.length > 0) {
    const prices = productExpenseData.map(item => item.price);
    const expenses = productExpenseData.map(item => item.expense);

    const calculateCorrelation = (arr1, arr2) => {
      const n = arr1.length;
      const sum1 = arr1.reduce((acc, value) => acc + value, 0);
      const sum2 = arr2.reduce((acc, value) => acc + value, 0);
      const sum1Sq = arr1.reduce((acc, value) => acc + value * value, 0);
      const sum2Sq = arr2.reduce((acc, value) => acc + value * value, 0);
      const pSum = arr1.reduce((acc, value, i) => acc + value * arr2[i], 0);

      const num = n * pSum - sum1 * sum2;
      const den = Math.sqrt(n * sum1Sq - sum1 * sum1) * Math.sqrt(n * sum2Sq - sum2 * sum2);

      if (den === 0) return 0;
      return num / den;
    };

    const correlation = calculateCorrelation(prices, expenses).toFixed(2);
    setCorrelationCoefficient(correlation);
  }
}, [productExpenseData]);

useEffect(() => {
  if (expenseRatio !== null && correlationCoefficient !== null) {
    fetch('http://localhost:1337/saveMetrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expenseRatio,
        correlationCoefficient,
      }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error saving data:', error));
  }
}, [expenseRatio, correlationCoefficient]);


  return (
    <>
    <DashBoardBox  gridArea="d">
    <BoxHeader
       title="Operational vs Non-Operational Expenses"
       sideText={expenseRatioTrend}
       /> 
    <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={operationalExpenses}
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
          orientation= "left"
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
          <Line
          yAxisId="left"
          type="monotone"
          dataKey="Non Operational Expenses"
          stroke={palette.tertiary[500]} 
          />
          <Line 
          yAxisId="right"
          type="monotone"
          dataKey="Operational Expenses"
          stroke={palette.primary.main} 
          />
        </LineChart>
      </ResponsiveContainer>
    </DashBoardBox>
    <DashBoardBox  gridArea="e">
      <BoxHeader title="Campaign and Targets" sideText="+4%" />
      <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
    <PieChart 
    width={110} 
    height={100}
    margin={{
      top:0,
      right: -10,
      left: 10,
      bottom: 0,
    }}>
        <Pie
          stroke="none"
          data={pieData}
          innerRadius={18}
          outerRadius={38}
          paddingAngle={2}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell 
            key={`cell-${index}`} 
            fill={pieColors[index]} />
          ))}
        </Pie>
      </PieChart>
      <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
         <Typography variant="h5">Target Sales</Typography>
         <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}> 83 </Typography>
         <Typography variant="h6"> 
         Finance goals of the campaign that is desired
         </Typography>
      </Box>
      <Box  flexBasis="40%">
         <Typography variant="h5">Losses in Revenue</Typography>
         <Typography variant="h6"> Losses are down 25% </Typography>
         <Typography mt="0.4rem" variant="h5"> 
          Profit Margins
         </Typography>
         <Typography variant="h6"> 
          Margins are up by 30% from last month.
         </Typography>
      </Box>
      </FlexBetween>
    </DashBoardBox>
    <DashBoardBox  gridArea="f">
    <BoxHeader title="Product Price vs Expenses" 
    sideText={correlationTrend} />
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 25,
            bottom: 40,
            left: 0,
          }}
        >
          <CartesianGrid stroke={palette.grey[800]} />
          <XAxis 
          type="number" 
          dataKey="price" 
          name="price" 
          axisLine={false}
          tickLine={false}
          style={{ fontSize: "10px"}}
          tickFormatter={(v) => `$${v}`}
          />
          <YAxis 
          type="number" 
          dataKey="expense" 
          name="expense" 
          axisLine={false}
          tickLine={false}
          style={{ fontSize: "10px"}}
          tickFormatter={(v) => `$${v}`}
          />
          <ZAxis type="number" range={[20]}/>
          <Tooltip formatter={(v) => `$${v}`}/>
          <Scatter 
          name="Product Expense Ratio"
          data={productExpenseData} 
          fill={palette.tertiary[500]}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </DashBoardBox> 
    </>
  );
}

export default Row2