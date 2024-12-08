import BoxHeader from '@/components/BoxHeader';
import DashBoardBox from '@/components/DashBoardBox';
import FlexBetween from '@/components/FlexBetween';
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from '@/state/api';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import React, { useEffect, useState, useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

type Props = {}

const Row3 = (props: Props) => {
    const { palette } = useTheme();
    const pieColors = [palette.primary[800], palette.primary[500]]
    const { data: kpiData } = useGetKpisQuery();
    const { data: productData } = useGetProductsQuery();
    const { data: transactionData } = useGetTransactionsQuery();
    const [derivedData, setDerivedData] = useState<any>(null);

 
 
    useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:1337/get-values');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setDerivedData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  fetchData();
}, []);
  

    const pieChartData = useMemo(() => {
      if (kpiData) {
        const totalExpenses = kpiData[0].totalExpenses;
        return Object.entries(kpiData[0].expensesByCategory).map(
          ([key, value]) => {
            return [
              {
                name: key,
                value: value,
              },
              {
                name: `${key} of Total`,
                value: totalExpenses - value,
              },
            ];
          }
        );
      }
    }, [kpiData]);

    const productColumns = [
      {
       field: "_id",
       headerName: "id",
       flex: 1,
      },
      {
       field: "expense",
       headerName: "Expense",
       flex: 0.5,
       renderCell: (params: GridCellParams) => `$${params.value}`,
      },
      {
       field: "price",
       headerName: "Price",
       flex: 0.5,
       renderCell: (params: GridCellParams) => `$${params.value}`,
      }
    ]


    const transactionColumns = [
      {
       field: "_id",
       headerName: "id",
       flex: 1,
      },
      {
       field: "buyer",
       headerName: "Buyer",
       flex: 0.67,
      },
      {
       field: "amount",
       headerName: "Amount",
       flex: 0.35,
       renderCell: (params: GridCellParams) => `$${params.value}`,
      },
      {
        field: "productIds",
        headerName: "Count",
        flex: 0.1,
        renderCell: (params: GridCellParams) => (params.value as Array<string>).length,
       },
    ]


    const getExpenseRatioInsight = (expenseRatio: number) => {
      if (expenseRatio > 2.0) {
        return 'The expense ratio is high, indicating that a significant portion of your revenue is allocated to expenses. Consider optimizing costs or increasing revenue streams.';
      } else if (expenseRatio > 1.0) {
        return 'The expense ratio is moderate, showing a balanced approach to managing expenses relative to revenue.';
      } else {
        return 'The expense ratio is low, suggesting efficient expense management or underutilization of resources. Ensure you are investing enough in growth opportunities.';
      }
    };
  
    const getCorrelationInsight = (correlationCoefficient: number) => {
      if (correlationCoefficient > 0.7) {
        return 'There is a strong positive correlation, indicating that changes in one variable are closely associated with changes in the other.';
      } else if (correlationCoefficient < -0.7) {
        return 'There is a strong negative correlation, meaning one variable tends to decrease as the other increases.';
      } else {
        return 'The correlation is weak or negligible, suggesting little to no direct relationship between the variables.';
      }
    };

  return (
    <>
    <DashBoardBox  gridArea="g">
     <BoxHeader
        title="List of Products"
        sideText={`${productData?.length} products`}
        />
        <Box
        mt="0.5rem"
        p="0 0.5rem"
        height="75%"
        sx={{
          "& .MuiDataGrid-root":{
            color: palette.grey[300],
            border: "none"
          },
          "& .MuiDataGrid-cell": {
             borderBottom: `1px solid ${palette.grey[800]} !important`,
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: `1px solid ${palette.grey[800]} !important`,
          },
          "& .MuiDataGrid-columnSeparator": {
            visibility: "hidden",
          },
        }}
        >
      <DataGrid
       columnHeaderHeight={25}
       rowHeight={35}
       hideFooter= {true}
       rows={productData || []} 
       columns={productColumns}
       />
      </Box>
    </DashBoardBox>
    <DashBoardBox  gridArea="h">
    <BoxHeader
        title="Recent Orders"
        sideText={`${transactionData?.length} latest transactions`}
        />
        <Box
        mt="1rem"
        p="0 0.5rem"
        height="80%"
        sx={{
          "& .MuiDataGrid-root":{
            color: palette.grey[300],
            border: "none"
          },
          "& .MuiDataGrid-cell": {
             borderBottom: `1px solid ${palette.grey[800]} !important`,
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: `1px solid ${palette.grey[800]} !important`,
          },
          "& .MuiDataGrid-columnSeparator": {
            visibility: "hidden",
          },
        }}
        >
      <DataGrid
       columnHeaderHeight={25}
       rowHeight={35}
       hideFooter= {true}
       rows={transactionData || []} 
       columns={transactionColumns}
       />
      </Box>
    </DashBoardBox>
    
    
    <DashBoardBox  gridArea="j">
    <BoxHeader 
    title="Overall Summary and Explanation Data" 
    sideText=""/>
         <Typography margin="0 1rem" variant="h5" justify-content="center">
          
         {derivedData ? (
            <>
              <p>{getExpenseRatioInsight(derivedData.expenseRatio)}</p>
              <p>{getCorrelationInsight(derivedData.correlationCoefficient)}</p>
            </>
          ) : (
            'Loading summary data...'
          )}
          </Typography> 
    </DashBoardBox>
    </>
  );
}

export default Row3