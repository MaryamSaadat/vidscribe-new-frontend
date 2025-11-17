import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import UploadIcon from '@mui/icons-material/Upload';
import LinkIcon from '@mui/icons-material/Link';
import { categories } from '../utils/constants';
import { Link, useLocation } from 'react-router-dom';
import logo from '../utils/Logo.png';
import type { Category } from '../utils/constants';

const drawerWidth = 240;

interface ResponsiveDrawerProps {
  window?: () => Window;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactElement> = {
  'Home': <HomeIcon />,
  'Upload Video': <UploadIcon />,
  'Youtube Video': <LinkIcon />,
};

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ 
  window: windowProp,
  selectedCategory,
  setSelectedCategory 
}) => {
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [isClosing, setIsClosing] = React.useState<boolean>(false);
  const location = useLocation();

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
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.paper'
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo Header */}
      <Box 
        sx={{ 
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 80
        }}
      >
        <Link 
          to="/" 
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1 }}
          aria-label="ViDScribe home"
        >
          <img 
            src={logo} 
            alt="ViDScribe Logo" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              maxHeight: '50px'
            }} 
          />
        </Link>
        {/* Close button for mobile */}
        <IconButton
          onClick={handleDrawerClose}
          sx={{ display: { sm: 'none' } }}
          aria-label="Close navigation menu"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* Navigation List */}
      <List 
        component="nav" 
        sx={{ flex: 1, pt: 2 }}
        aria-label="Navigation menu"
      >
        {categories.map((category: Category, idx: number) => {
          const isActive = location.pathname === category.href;
          
          return (
            <ListItem 
              key={category.name} 
              disablePadding
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                component={Link}
                to={category.href}
                selected={isActive}
                onClick={() => {
                  if (setSelectedCategory) {
                    setSelectedCategory(category.name);
                  }
                  if (mobileOpen) {
                    handleDrawerClose();
                  }
                }}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                aria-label={`Navigate to ${category.name}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {categoryIcons[category.name] || <HomeIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary={category.name}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} ViDScribe
        </Box>
      </Box>
    </Box>
  );

  const container = windowProp !== undefined ? () => windowProp().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="Main navigation"
    >
      {/* Mobile menu button */}
      <IconButton
        color="inherit"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        aria-controls="mobile-drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          ml: 2, 
          mt: 2,
          display: { sm: 'none' },
          position: 'fixed',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'action.hover',
          }
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        id="mobile-drawer"
        ModalProps={{
          keepMounted: true,
          'aria-hidden': !mobileOpen,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            boxShadow: 3
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 1,
            borderColor: 'divider'
          },
        }}
        open
        aria-label="Main navigation"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default ResponsiveDrawer;