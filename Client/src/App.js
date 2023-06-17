import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber, red} from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import AlbumInfoPage from './pages/AlbumInfoPage'
import FunFactsPage from "./pages/FunFactsPage";
import ComparisonPage from "./pages/ComparisonPage";
import RankingsPage from "./pages/RankingsPage";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: red,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/funfacts" element={<FunFactsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}