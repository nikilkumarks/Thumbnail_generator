export const SIZE_PRESETS = {
  youtube: { width: 1280, height: 720, label: 'YouTube', ratio: '16:9' },
  shorts: { width: 1080, height: 1920, label: 'Shorts', ratio: '9:16' },
  community: { width: 1080, height: 1080, label: 'Community', ratio: '1:1' },
};

export const TEXT_POSITIONS = [
  { id: 'top-left', label: 'Top left' },
  { id: 'top-center', label: 'Top center' },
  { id: 'bottom-left', label: 'Bottom left' },
  { id: 'bottom-center', label: 'Bottom center' },
];

export const EDIT_PRESETS = [
  { id: 'background', label: 'Change background', instruction: 'change the background to a dramatic blurred gradient while keeping the subject' },
  { id: 'face', label: 'Enhance face', instruction: 'enhance and sharpen the face, improve lighting on the face only' },
  { id: 'glow', label: 'Add glow', instruction: 'add a vibrant cinematic glow effect around the main subject' },
  { id: 'contrast', label: 'Boost contrast', instruction: 'increase contrast and saturation for a bolder YouTube thumbnail look' },
];
