const SIZE_PRESETS = {
  youtube: { width: 1280, height: 720, label: 'YouTube Thumbnail' },
  shorts: { width: 1080, height: 1920, label: 'YouTube Shorts' },
  community: { width: 1080, height: 1080, label: 'Community Post' },
};

const getSizePreset = (key) => SIZE_PRESETS[key] || SIZE_PRESETS.youtube;

module.exports = { SIZE_PRESETS, getSizePreset };
