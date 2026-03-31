import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Typography, TextField, Button, Card } from '@mui/material';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Home from './pages/Home';
import ScheduleEditor from './pages/ScheduleEditor';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
});

export default function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Check if user name is already stored in localStorage on app load
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Function to save the user name and allow access to the app
  const handleSaveName = () => {
    if (inputValue.trim()) {
      localStorage.setItem('userName', inputValue.trim());
      window.history.replaceState(null, '', '/');
      setUserName(inputValue.trim());
    }
  };

  // If user name is not set, show the welcome screen to enter the name
  if (!userName) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', p: 2 }}>
        <Card variant="outlined" sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Welcome!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Enter your name to continue. This helps track who edited the schedule.
          </Typography>

          <TextField
            label="Your Name"
            variant="outlined"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // Allow pressing Enter on keyboard to submit
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSaveName}
            disabled={!inputValue.trim()}
          >
            Enter
          </Button>
        </Card>
      </Box>
    );
  }

  // If user name is set, load the normal application
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', position: 'relative', pb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor/:id" element={<ScheduleEditor />} />
          </Routes>

          <Box
            component="footer"
            sx={{
              position: 'fixed',
              right: 12,
              bottom: 12,
              p: 1.5,
              px: 2,
              backgroundColor: 'rgba(255,255,255,0.85)',
              borderRadius: 1,
              boxShadow: 2,
              zIndex: 999,
              border: '1px solid rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'nowrap' }}>
              © {new Date().getFullYear()} - Schedule Project - v0.1.0
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'nowrap', mb: 1 }}>
              Support: <strong>dimaggio.emanuele@gmail.com</strong>
            </Typography>

            <a
              href="https://www.buymeacoffee.com/emalter"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=emalter&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff"
                alt="Buy me a coffee"
                style={{ height: '40px', display: 'block' }}
              />
            </a>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}