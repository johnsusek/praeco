import { expect } from 'chai';

import {
  discordEmbedColorToHex,
  hexToDiscordEmbedColor
} from '@/composables/config/alert/useConfigAlertDiscord';

describe('useConfigAlertDiscord helpers', () => {
  it('converts a Discord decimal color to hex for the picker', () => {
    expect(discordEmbedColorToHex(3447003)).to.equal('#3498db');
  });

  it('returns null for an invalid Discord decimal color', () => {
    expect(discordEmbedColorToHex(16777216)).to.equal(null);
  });

  it('converts a picker hex value back to a Discord decimal color', () => {
    expect(hexToDiscordEmbedColor('#3498DB')).to.equal(3447003);
  });

  it('returns null for an invalid picker hex value', () => {
    expect(hexToDiscordEmbedColor('#12345')).to.equal(null);
  });
});
