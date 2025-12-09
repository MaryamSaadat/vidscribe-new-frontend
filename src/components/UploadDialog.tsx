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
  subjectiveness?: 'objective' | 'subjective';
  colorPreference?: 'include' | 'exclude';
  frequency?: 8 | 15 | 30;
  personalGuidelines?: string;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, setOpen, onConfirm }) => {
  const [mode, setMode] = React.useState<'none' | 'custom'>('none');
  const [length, setLength] = React.useState<number>(50);
  const [emphasis, setEmphasis] = React.useState<string>('general');
  const [subjectiveness, setSubjectiveness] = React.useState<string>('objective');
  const [colorPreference, setColorPreference] = React.useState<string>('include');
  const [frequency, setFrequency] = React.useState<number>(15);
  const [personalGuidelines, setPersonalGuidelines] = React.useState<string>('');

  const handleClose = (): void => {
    setOpen(false);
    resetForm();
  };

  const resetForm = (): void => {
    setMode('none');
    setLength(50);
    setEmphasis('general');
    setSubjectiveness('objective');
    setColorPreference('include');
    setFrequency(15);
    setPersonalGuidelines('');
  };

  const handleConfirm = (): void => {
    const settings: CustomizationSettings = {
      mode,
      ...(mode === 'custom' && { 
        length, 
        emphasis: emphasis as CustomizationSettings['emphasis'],
        subjectiveness: subjectiveness as CustomizationSettings['subjectiveness'],
        colorPreference: colorPreference as CustomizationSettings['colorPreference'],
        frequency: frequency as CustomizationSettings['frequency'],
        personalGuidelines: personalGuidelines || undefined
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

            {/* Frequency Options */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
              <FormLabel 
                component="legend" 
                sx={{ mb: 2, fontWeight: 500 }}
                id="frequency-options-label"
              >
                Description Frequency
              </FormLabel>
              <RadioGroup 
                value={frequency} 
                onChange={(e) => setFrequency(Number(e.target.value))}
                aria-labelledby="frequency-options-label"
              >
                <FormControlLabel 
                  value={8} 
                  control={<Radio inputProps={{ 'aria-label': 'Frequent descriptions - Approximately every 8 seconds' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Frequent (Every ~8 seconds)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Maximum detail with descriptions appearing frequently throughout the video
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value={15} 
                  control={<Radio inputProps={{ 'aria-label': 'Moderate descriptions - Approximately every 15 seconds' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Moderate (Every ~15 seconds)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Balanced pacing with regular description intervals
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value={30} 
                  control={<Radio inputProps={{ 'aria-label': 'Sparse descriptions - Approximately every 30 seconds' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Sparse (Every ~30 seconds)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Less frequent descriptions focusing on major visual changes only
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Choose how often audio descriptions should appear during the video
              </Typography>
            </FormControl>

            <Divider sx={{ my: 3 }}/>

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

            {/* Subjectiveness Options */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
              <FormLabel 
                component="legend" 
                sx={{ mb: 2, fontWeight: 500 }}
                id="subjectiveness-options-label"
              >
                Description Style
              </FormLabel>
              <RadioGroup 
                value={subjectiveness} 
                onChange={(e) => setSubjectiveness(e.target.value)}
                aria-labelledby="subjectiveness-options-label"
              >
                <FormControlLabel 
                  value="objective" 
                  control={<Radio inputProps={{ 'aria-label': 'Objective style - Factual descriptions only' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Objective</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Factual, neutral descriptions without interpretation or emotion
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="subjective" 
                  control={<Radio inputProps={{ 'aria-label': 'Subjective style - Interpretive descriptions with mood and atmosphere' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Subjective</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Interpretive descriptions including mood, atmosphere, and emotional context
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Choose whether descriptions should be purely factual or include interpretive elements
              </Typography>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* Color Preference Options */}
            <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
              <FormLabel 
                component="legend" 
                sx={{ mb: 2, fontWeight: 500 }}
                id="color-preference-label"
              >
                Color Descriptions
              </FormLabel>
              <RadioGroup 
                value={colorPreference} 
                onChange={(e) => setColorPreference(e.target.value)}
                aria-labelledby="color-preference-label"
              >
                <FormControlLabel 
                  value="include" 
                  control={<Radio inputProps={{ 'aria-label': 'Include color descriptions - Describe colors of objects, clothing, and scenes' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Include Colors</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Describe colors of objects, clothing, environments, and visual elements
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="exclude" 
                  control={<Radio inputProps={{ 'aria-label': 'Exclude color descriptions - Focus on shapes, textures, and spatial information' }} />} 
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Exclude Colors</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Omit color information and focus on shapes, textures, and spatial relationships
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Choose whether color information should be included in audio descriptions
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
                placeholder="Enter any specific preferences or instructions for audio description generation... (e.g., 'Avoid technical jargon', 'Focus on emotional tone', 'Use specific terminology')"
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