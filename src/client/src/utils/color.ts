import { generate, presetPrimaryColors, presetPalettes } from '@ant-design/colors';
import { schemeGreys } from "d3-scale-chromatic"; 
import _ from "lodash"; 

// generated at https://ant.design/docs/spec/colors
export const colors: any = (() => {

    // All of the sequential color palettes (generated with primary colors)
    // we have to use for styling purposes within our application 
    const colors = Object.entries(presetPrimaryColors).reduce((acc: any, [palette_name, color]: [string, string]) => {
        if (palette_name === 'grey') {
            // TODO: something is wrong with the antd color grey color palette so 
            //       we use a d3 palette instead. 
            acc[palette_name] = schemeGreys[9]; 
            acc[palette_name].primary = acc[palette_name][4]; 
        } else {
            acc[palette_name] = generate(color, { theme: 'dark', backgroundColor: '#141414' });
        }
        return acc; 
    }, {});

    // Create style variables, that will allow us to abstract stylings to the component level 
    const vars = {
        'body_background': colors.blue[3], 
        'timeaxis_background': colors.grey[2], 
        'timeaxis_border': `1px solid ${colors.grey[5]}`, 
        'timeaxis_text_normal_low_contrast': colors.grey[5], 
        'timeaxis_text_normal_high_contrast': colors.grey[7], 
        'timeaxis_text_current_low_contrast': colors.grey[2], 
        'timeaxis_text_current_high_contrast': colors.grey[0], 
        'shift_button_color': colors.grey[3], 
        'habitlist_title_color': colors.grey[6], 
        'habitlist_header_border_bottom': 0, // `1px solid ${colors.grey[3]}`
        'left_span': 14, 
        'right_span': 14, 
        'gridRowContainerPadding': {
            paddingTop: 5, 
            paddingRight: 5, 
            paddingBottom: 0, 
            paddingLeft: 5
        }, 
        'glyph_background_color': "#f8f8f8", 
        'habit_card_inner_border_inactive': `1px solid ${colors.grey[2]}`, 
        'habit_card_inner_border_active': `1px solid ${colors.grey[4]}`
    }; 

    const merged = Object.assign(colors, vars); 

    return merged; 

})(); 