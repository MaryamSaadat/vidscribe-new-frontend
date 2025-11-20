import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Divider, Typography } from '@mui/material';

interface UploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: (customizations?: CustomizationSettings) => void;
}

interface CustomizationSettings {
  mode: 'none' | 'custom';
  length?: number;
  emphasis?: 'character' | 'environment' | 'general' | 'instructional';
  personalGuidelines?: string;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, setOpen, onConfirm }) => {
  const [mode, setMode] = React.useState<'none' | 'custom'>('none');
  const [length, setLength] = React.useState<number>(50);
  const [emphasis, setEmphasis] = React.useState<string>('general');
  const [personalGuidelines, setPersonalGuidelines] = React.useState<string>('');

  const handleClose = (): void => {
    setOpen(false);
    resetForm();
  };

  const resetForm = (): void => {
    setMode('none');
    setLength(50);
    setEmphasis('general');
    setPersonalGuidelines('');
  };

  const handleConfirm = (): void => {
    const settings: CustomizationSettings = {
      mode,
      ...(mode === 'custom' && { 
        length, 
        emphasis: emphasis as CustomizationSettings['emphasis'],
        personalGuidelines: personalGuidelines.trim() || undefined
      })
    };
    onConfirm(settings);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="upload-dialog-title"
      aria-describedby="upload-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="upload-dialog-title">
        Upload Confirmation & Audio Description Settings
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="upload-dialog-description" sx={{ mb: 3 }}>
          Your video will be uploaded to public. Configure audio description customizations or proceed with defaults.
        </DialogContentText>

        <FormControl component="fieldset" fullWidth>
          <FormLabel 
            component="legend" 
            sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}
            id="customization-options-label"
          >
            Customization Options
          </FormLabel>
          <RadioGroup 
            value={mode} 
            onChange={(e) => setMode(e.target.value as 'none' | 'custom')}
            aria-labelledby="customization-options-label"
          >
            <FormControlLabel 
              value="none" 
              control={<Radio inputProps={{ 'aria-label': 'Proceed without customizations' }} />} 
              label="Use default settings for audio descriptions" 
            />
            <FormControlLabel 
              value="custom" 
              control={<Radio inputProps={{ 'aria-label': 'Add custom audio description settings' }} />} 
              label="Customize audio description settings" 
            />
          </RadioGroup>
        </FormControl>

        {mode === 'custom' && (
          <Box 
            sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
            role="region"
            aria-label="Audio description customization settings"
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Audio Description Settings
            </Typography>

            {/* Length Slider */}
            <FormControl fullWidth sx={{ mb: 4 }}>
              <FormLabel 
                sx={{ mb: 2, fontWeight: 500 }}
                id="length-slider-label"
              >
                Description Length: {length} words
              </FormLabel>
              <Slider
                value={length}
                onChange={(_, value) => setLength(value as number)}
                min={15}
                max={100}
                step={5}
                marks={[
                  { value: 15, label: '15' },
                  { value: 50, label: '50 words' },
                  { value: 100, label: '100' }
                ]}
                valueLabelDisplay="auto"
                aria-labelledby="length-slider-label"
                aria-valuetext={`${length} words`}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Adjust the target length for each audio description segment
              </Typography>
            </FormControl>

            <Divider sx={{ my: 3 }}/>

            {/* Emphasis Options */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
              <FormLabel 
                component="legend" 
                sx={{ mb: 2, fontWeight: 500 }}
                id="emphasis-options-label"
              >
                Description Emphasis
              </FormLabel>
              <RadioGroup 
                value={emphasis} 
                onChange={(e) => setEmphasis(e.target.value)}
                aria-labelledby="emphasis-options-label"
              >
                <FormControlLabel 
                  value="character" 
                  control={<Radio inputProps={{ 'aria-label': 'Character emphasis - Focus on people and their actions' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Character Focus</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Emphasize people, their actions, and expressions
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="environment" 
                  control={<Radio inputProps={{ 'aria-label': 'Environment emphasis - Focus on settings and surroundings' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Environment Focus</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Emphasize settings, locations, and surroundings
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="general" 
                  control={<Radio inputProps={{ 'aria-label': 'General emphasis - Balanced description approach' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Balanced Focus</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Equal attention to all visual elements
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="instructional" 
                  control={<Radio inputProps={{ 'aria-label': 'Instructional emphasis - Focus on steps and processes' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Instructional Focus</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Emphasize steps, processes, and how-to information
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Choose what aspect should be prioritized in the descriptions
              </Typography>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* Personal Guidelines */}
            <FormControl fullWidth>
              <FormLabel 
                sx={{ mb: 2, fontWeight: 500 }}
                htmlFor="personal-guidelines-input"
              >
                Additional Guidelines (Optional)
              </FormLabel>
              <TextField
                id="personal-guidelines-input"
                fullWidth
                multiline
                rows={4}
                placeholder="Enter any specific preferences or instructions for audio description generation... (e.g., 'Avoid technical jargon', 'Focus on emotional tone', 'Include color descriptions')"
                value={personalGuidelines}
                onChange={(e) => setPersonalGuidelines(e.target.value)}
                variant="outlined"
                inputProps={{
                  'aria-label': 'Additional personal guidelines for audio descriptions',
                  'aria-describedby': 'guidelines-helper-text',
                }}
              />
              <Typography 
                id="guidelines-helper-text"
                variant="caption" 
                color="text.secondary" 
                sx={{ mt: 1 }}
              >
                Provide specific instructions or preferences to further customize the audio descriptions
              </Typography>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          aria-label="Cancel upload"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="primary" 
          autoFocus
          aria-label="Confirm and proceed with upload"
        >
          Proceed with Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;