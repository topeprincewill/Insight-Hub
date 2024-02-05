import { Box } from "@mui/material"
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { CssBaseline, ThemeProvider} from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themeSettings } from "@/theme";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";
import Predictions from "@/scenes/predictions"

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
const theme =  useMemo(() => createTheme(themeSettings), []);
  return( 
  <div className="app">
    <BrowserRouter>
    <ThemeProvider 
     //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    theme={theme}>
        <CssBaseline />
        <Box width="100%" height="100%" padding="1rem 2em 4rem 2em"> 
        <Navbar/>
           <Routes>
               <Route path ="/" element={<Dashboard />} />
               <Route 
               path ="/predictions" 
               element={<Predictions />} />
           </Routes>
        </Box>
    </ThemeProvider>
    </BrowserRouter>

  </div>
  );
}

export default App

