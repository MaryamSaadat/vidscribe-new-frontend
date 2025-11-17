import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { categories } from '../utils/constants';
import { Link } from 'react-router-dom';
import logo from '../utils/Logo.png';
import type { Category } from '../utils/constants';

const drawerWidth = 200;

interface ResponsiveDrawerProps {
  window?: () => Window;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
}

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ 
  window: windowProp,
  selectedCategory,
  setSelectedCategory 
}) => {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [isClosing, setIsClosing] = React.useState<boolean>(false);

  const handleDrawerClose = (): void => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = (): void => {
    setIsClosing(false);
  };

  const handleDrawerToggle = (): void => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Box sx={{ p: 2 }}>
        <img 
          src={logo} 
          alt="ViDScribe Logo" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
      </Box>
      <Divider />
      {categories.map((category: Category, idx: number) => (
        <Link to={category.href} className="full-width" key={idx}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
          <Divider />
        </Link>
      ))}
    </div>
  );

  // Remove this const assignment if you never pass the window prop:
  const container = windowProp !== undefined ? () => windowProp().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="menu options, home, upload video, use URL"
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ ml: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default ResponsiveDrawer;