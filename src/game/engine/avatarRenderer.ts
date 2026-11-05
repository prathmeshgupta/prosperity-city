export interface AvatarVisualSpec {
  skinTone: string;
  hairColor: string;
  hairStyle: 'BOB' | 'CURLS' | 'FADE' | 'CREW' | 'SPIKY' | 'BUN' | 'PONYTAIL' | 'WAVY';
  outfitType: 'STUDENT' | 'CREATIVE' | 'CORPORATE' | 'TRADES' | 'STREETWEAR' | 'DOCTOR' | 'TECH' | 'CASUAL';
  primaryOutfitColor: string;
  accentColor: string;
  hatType?: 'GRADUATION' | 'BERET' | 'HARDHAT' | 'HEADBAND' | 'NONE';
  hatColor?: string;
  hasGlasses?: boolean;
  accessory?: 'STETHOSCOPE' | 'TIE' | 'TOOL_BELT' | 'SATCHEL' | 'LANYARD' | 'NONE';
}

/**
 * Maps avatar emojis and archetypes to high-fidelity visual character sprites.
 */
export function getAvatarVisualSpec(avatarEmoji: string, archetypeId?: string): AvatarVisualSpec {
  switch (archetypeId) {
    case 'archetype_fresh_grad':
    case '🎓':
      return {
        skinTone: '#fed7aa',
        hairColor: '#0f172a',
        hairStyle: 'BOB',
        outfitType: 'STUDENT',
        primaryOutfitColor: '#881337', // Crimson collegiate sweater
        accentColor: '#fde047',
        hatType: 'GRADUATION',
        hatColor: '#1e1b4b',
        accessory: 'SATCHEL',
      };

    case 'archetype_freelancer':
    case '🎨':
      return {
        skinTone: '#d4a373',
        hairColor: '#332211',
        hairStyle: 'CURLS',
        outfitType: 'CREATIVE',
        primaryOutfitColor: '#2563eb', // Indigo denim jacket
        accentColor: '#f97316',
        hatType: 'BERET',
        hatColor: '#ea580c',
        accessory: 'NONE',
      };

    case 'archetype_corporate':
    case '💼':
      return {
        skinTone: '#8d5524',
        hairColor: '#0f172a',
        hairStyle: 'FADE',
        outfitType: 'CORPORATE',
        primaryOutfitColor: '#1e3a8a', // Navy corporate blazer
        accentColor: '#ffffff',
        hatType: 'NONE',
        accessory: 'TIE',
      };

    case 'archetype_tradesperson':
    case '🛠️':
      return {
        skinTone: '#fed7aa',
        hairColor: '#78350f',
        hairStyle: 'CREW',
        outfitType: 'TRADES',
        primaryOutfitColor: '#facc15', // High-vis work jacket
        accentColor: '#1e293b',
        hatType: 'HARDHAT',
        hatColor: '#f59e0b',
        accessory: 'TOOL_BELT',
      };

    case 'archetype_teen_hustler':
    case '⚡':
      return {
        skinTone: '#fed7aa',
        hairColor: '#1e293b',
        hairStyle: 'SPIKY',
        outfitType: 'STREETWEAR',
        primaryOutfitColor: '#7c3aed', // Purple streetwear hoodie
        accentColor: '#06b6d4',
        hatType: 'HEADBAND',
        hatColor: '#06b6d4',
        accessory: 'NONE',
      };

    case 'archetype_doctor':
    case '👩‍⚕️':
    case '🩺':
      return {
        skinTone: '#fed7aa',
        hairColor: '#b45309',
        hairStyle: 'BUN',
        outfitType: 'DOCTOR',
        primaryOutfitColor: '#ffffff', // White lab coat
        accentColor: '#0d9488', // Teal scrub interior
        hatType: 'NONE',
        accessory: 'STETHOSCOPE',
      };

    case 'archetype_tech_founder':
    case '🧑‍💻':
    case '💻':
      return {
        skinTone: '#c68642',
        hairColor: '#0f172a',
        hairStyle: 'PONYTAIL',
        outfitType: 'TECH',
        primaryOutfitColor: '#18181b', // Black tech turtleneck
        accentColor: '#3b82f6',
        hatType: 'NONE',
        hasGlasses: true,
        accessory: 'LANYARD',
      };

    case 'archetype_family_parent':
    case '🏡':
    case '👨‍👧':
      return {
        skinTone: '#a16207',
        hairColor: '#1c1917',
        hairStyle: 'WAVY',
        outfitType: 'CASUAL',
        primaryOutfitColor: '#15803d', // Forest green cozy cardigan
        accentColor: '#eab308',
        hatType: 'NONE',
        accessory: 'NONE',
      };

    default:
      // Fallback matching by avatar emoji
      if (avatarEmoji.includes('🎓')) {
        return getAvatarVisualSpec(avatarEmoji, 'archetype_fresh_grad');
      } else if (avatarEmoji.includes('🎨')) {
        return getAvatarVisualSpec(avatarEmoji, 'archetype_freelancer');
      } else if (avatarEmoji.includes('💼')) {
        return getAvatarVisualSpec(avatarEmoji, 'archetype_corporate');
      } else if (avatarEmoji.includes('🛠️') || avatarEmoji.includes('🔧')) {
        return getAvatarVisualSpec(avatarEmoji, 'archetype_tradesperson');
      } else if (avatarEmoji.includes('⚡') || avatarEmoji.includes('🔥')) {
        return getAvatarVisualSpec(avatarEmoji, 'archetype_teen_hustler');
      } else if (avatarEmoji.includes('👩‍⚕️') || avatarEmoji.includes('👨‍⚕️') || avatarEmoji.includes('🩺')) {
        return getAvatarVisualSpec(avatarEmoji, 'archetype_doctor');
      } else if (avatarEmoji.includes('🧑‍💻') || avatarEmoji.includes('💻')) {
        return getAvatarVisualSpec(avatarEmoji, 'archetype_tech_founder');
      }

      return {
        skinTone: '#fed7aa',
        hairColor: '#1e293b',
        hairStyle: 'BOB',
        outfitType: 'CASUAL',
        primaryOutfitColor: '#10b981',
        accentColor: '#ffffff',
        hatType: 'NONE',
        accessory: 'NONE',
      };
  }
}

/**
 * High-detail procedural character sprite renderer.
 * Replaces generic blob with stylized, animated retro-modern RPG sprite.
 */
export function renderPlayerSprite(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  direction: 'up' | 'down' | 'left' | 'right',
  isMoving: boolean,
  walkFrame: number,
  spec: AvatarVisualSpec
) {
  const walkBob = isMoving ? Math.sin(walkFrame * 0.8) * 3 : 0;
  const legOffset = isMoving ? Math.sin(walkFrame * 0.8) * 6 : 0;
  const armOffset = isMoving ? Math.cos(walkFrame * 0.8) * 5 : 0;

  // 1. Soft Dynamic Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(screenX, screenY + 16, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Legs & Shoes
  ctx.fillStyle = '#0f172a'; // Pants / Jeans
  // Left Leg
  ctx.fillRect(screenX - 7, screenY + 7 + legOffset, 5, 8);
  // Right Leg
  ctx.fillRect(screenX + 2, screenY + 7 - legOffset, 5, 8);

  // Shoes / Sneakers
  ctx.fillStyle = '#334155';
  ctx.fillRect(screenX - 8, screenY + 14 + legOffset, 6, 3);
  ctx.fillRect(screenX + 2, screenY + 14 - legOffset, 6, 3);

  // 3. Torso / Outfit
  ctx.fillStyle = spec.primaryOutfitColor;
  ctx.beginPath();
  ctx.roundRect(screenX - 11, screenY - 10 + walkBob, 22, 18, 5);
  ctx.fill();

  // Outfit specific details
  if (spec.outfitType === 'CORPORATE') {
    // White shirt V
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(screenX - 3, screenY - 10 + walkBob);
    ctx.lineTo(screenX + 3, screenY - 10 + walkBob);
    ctx.lineTo(screenX, screenY - 2 + walkBob);
    ctx.fill();

    // Red necktie
    if (direction !== 'up') {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(screenX - 1.5, screenY - 8 + walkBob);
      ctx.lineTo(screenX + 1.5, screenY - 8 + walkBob);
      ctx.lineTo(screenX + 1, screenY + 4 + walkBob);
      ctx.lineTo(screenX, screenY + 6 + walkBob);
      ctx.lineTo(screenX - 1, screenY + 4 + walkBob);
      ctx.fill();
    }
  } else if (spec.outfitType === 'DOCTOR') {
    // Teal scrubs showing inside
    ctx.fillStyle = spec.accentColor;
    ctx.fillRect(screenX - 4, screenY - 10 + walkBob, 8, 14);

    // Lab coat lapels
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(screenX - 11, screenY - 10 + walkBob, 6, 18);
    ctx.fillRect(screenX + 5, screenY - 10 + walkBob, 6, 18);

    // Stethoscope
    if (spec.accessory === 'STETHOSCOPE' && direction !== 'up') {
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(screenX, screenY - 5 + walkBob, 5, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(screenX - 1.5, screenY + 1 + walkBob, 3, 3);
    }
  } else if (spec.outfitType === 'TRADES') {
    // Reflective safety stripe across chest
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(screenX - 11, screenY - 3 + walkBob, 22, 3);

    // Utility belt
    if (spec.accessory === 'TOOL_BELT') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(screenX - 11, screenY + 5 + walkBob, 22, 3);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(screenX - 2, screenY + 4.5 + walkBob, 4, 4); // brass buckle
    }
  } else if (spec.outfitType === 'STREETWEAR') {
    // Kangaroo pocket
    ctx.fillStyle = '#6d28d9';
    ctx.beginPath();
    ctx.roundRect(screenX - 7, screenY - 1 + walkBob, 14, 7, 3);
    ctx.fill();

    // Hoodie drawstrings
    ctx.strokeStyle = spec.accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(screenX - 3, screenY - 9 + walkBob);
    ctx.lineTo(screenX - 3, screenY - 2 + walkBob);
    ctx.moveTo(screenX + 3, screenY - 9 + walkBob);
    ctx.lineTo(screenX + 3, screenY - 2 + walkBob);
    ctx.stroke();
  } else if (spec.outfitType === 'STUDENT') {
    // White shirt collar peeking out
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(screenX - 4, screenY - 10 + walkBob);
    ctx.lineTo(screenX, screenY - 6 + walkBob);
    ctx.lineTo(screenX + 4, screenY - 10 + walkBob);
    ctx.stroke();

    // Crossbody satchel strap
    if (spec.accessory === 'SATCHEL') {
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(screenX - 10, screenY - 8 + walkBob);
      ctx.lineTo(screenX + 10, screenY + 6 + walkBob);
      ctx.stroke();
    }
  }

  // 4. Arms & Hands
  ctx.fillStyle = spec.primaryOutfitColor;
  // Left Arm
  ctx.beginPath();
  ctx.roundRect(screenX - 14, screenY - 9 + walkBob + armOffset, 4, 12, 2);
  ctx.fill();
  // Right Arm
  ctx.beginPath();
  ctx.roundRect(screenX + 10, screenY - 9 + walkBob - armOffset, 4, 12, 2);
  ctx.fill();

  // Hands (Skin Tone)
  ctx.fillStyle = spec.skinTone;
  ctx.fillRect(screenX - 14, screenY + 3 + walkBob + armOffset, 4, 3.5);
  ctx.fillRect(screenX + 10, screenY + 3 + walkBob - armOffset, 4, 3.5);

  // 5. Head (Skin Tone)
  ctx.fillStyle = spec.skinTone;
  ctx.beginPath();
  ctx.arc(screenX, screenY - 18 + walkBob, 11, 0, Math.PI * 2);
  ctx.fill();

  // 6. Hair & Headwear
  ctx.fillStyle = spec.hairColor;

  if (spec.hairStyle === 'BOB') {
    // Sleek Bob
    ctx.beginPath();
    ctx.arc(screenX, screenY - 20 + walkBob, 12, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    // Side bangs
    ctx.fillRect(screenX - 12, screenY - 20 + walkBob, 4, 10);
    ctx.fillRect(screenX + 8, screenY - 20 + walkBob, 4, 10);
  } else if (spec.hairStyle === 'CURLS') {
    // Voluminous curls
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(screenX + i * 5, screenY - 23 + walkBob, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.hairStyle === 'FADE') {
    // Clean fade
    ctx.beginPath();
    ctx.arc(screenX, screenY - 21 + walkBob, 11, Math.PI, Math.PI * 2);
    ctx.fill();
  } else if (spec.hairStyle === 'CREW') {
    // Short crew cut
    ctx.beginPath();
    ctx.arc(screenX, screenY - 20 + walkBob, 11.5, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
  } else if (spec.hairStyle === 'SPIKY') {
    // Spiky dynamic hair
    ctx.beginPath();
    ctx.arc(screenX, screenY - 20 + walkBob, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    // Spikes
    for (let s = -8; s <= 8; s += 4) {
      ctx.beginPath();
      ctx.moveTo(screenX + s - 2, screenY - 24 + walkBob);
      ctx.lineTo(screenX + s, screenY - 29 + walkBob);
      ctx.lineTo(screenX + s + 2, screenY - 24 + walkBob);
      ctx.fill();
    }
  } else if (spec.hairStyle === 'BUN') {
    // Professional hair bun
    ctx.beginPath();
    ctx.arc(screenX, screenY - 20 + walkBob, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(screenX, screenY - 29 + walkBob, 5.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (spec.hairStyle === 'PONYTAIL') {
    // High ponytail
    ctx.beginPath();
    ctx.arc(screenX, screenY - 20 + walkBob, 11, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(screenX + (direction === 'left' ? 10 : -10), screenY - 22 + walkBob, 5, 8, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Wavy
    ctx.beginPath();
    ctx.arc(screenX, screenY - 21 + walkBob, 12, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
  }

  // 7. Hats & Headgear
  if (spec.hatType === 'GRADUATION') {
    // Mortarboard cap
    ctx.fillStyle = spec.hatColor || '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(screenX, screenY - 33 + walkBob);
    ctx.lineTo(screenX + 16, screenY - 27 + walkBob);
    ctx.lineTo(screenX, screenY - 21 + walkBob);
    ctx.lineTo(screenX - 16, screenY - 27 + walkBob);
    ctx.closePath();
    ctx.fill();

    // Golden tassel
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(screenX, screenY - 27 + walkBob);
    ctx.lineTo(screenX + 12, screenY - 22 + walkBob);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(screenX + 11, screenY - 22 + walkBob, 2.5, 5);
  } else if (spec.hatType === 'BERET') {
    ctx.fillStyle = spec.hatColor || '#ea580c';
    ctx.beginPath();
    ctx.ellipse(screenX - 2, screenY - 25 + walkBob, 13, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (spec.hatType === 'HARDHAT') {
    ctx.fillStyle = spec.hatColor || '#f59e0b';
    ctx.beginPath();
    ctx.arc(screenX, screenY - 22 + walkBob, 12.5, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    // Rim
    ctx.fillRect(screenX - 14, screenY - 22 + walkBob, 28, 3.5);
  } else if (spec.hatType === 'HEADBAND') {
    ctx.fillStyle = spec.hatColor || '#06b6d4';
    ctx.fillRect(screenX - 10, screenY - 24 + walkBob, 20, 3.5);
  }

  // 8. Facial Features (Directional Eyes, Glasses, Expression)
  if (direction !== 'up') {
    // Glasses
    if (spec.hasGlasses) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(screenX - 8, screenY - 20 + walkBob, 6, 5);
      ctx.strokeRect(screenX + 2, screenY - 20 + walkBob, 6, 5);
      ctx.beginPath();
      ctx.moveTo(screenX - 2, screenY - 18 + walkBob);
      ctx.lineTo(screenX + 2, screenY - 18 + walkBob);
      ctx.stroke();
    }

    // Eyes
    ctx.fillStyle = '#0f172a';
    if (direction === 'down') {
      ctx.fillRect(screenX - 5, screenY - 18 + walkBob, 2.5, 3.5);
      ctx.fillRect(screenX + 2.5, screenY - 18 + walkBob, 2.5, 3.5);
      // Gentle smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(screenX, screenY - 14 + walkBob, 3, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else if (direction === 'left') {
      ctx.fillRect(screenX - 8, screenY - 18 + walkBob, 2.5, 3.5);
    } else if (direction === 'right') {
      ctx.fillRect(screenX + 5.5, screenY - 18 + walkBob, 2.5, 3.5);
    }
  }
}
