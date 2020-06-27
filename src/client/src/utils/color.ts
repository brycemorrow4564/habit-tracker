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

    const { blue, grey } = colors; 

    const themes = {
        "theme_one": {
            'body_background': blue[1], 
            'timeaxis_background': '#556676', 
            'timeaxis_border': `1px solid ${grey[2]}`, 
            'timeaxis_text_normal_low_contrast': grey[5], 
            'timeaxis_text_normal_high_contrast': grey[7], 
            'timeaxis_text_current_low_contrast': grey[2], 
            'timeaxis_text_current_high_contrast': grey[0], 
            'shift_button_color': grey[1], 
            'habitlist_title_color': grey[0], 
            'habitlist_header_border_bottom': 0, 
            'left_span': 14, 
            'right_span': 14, 
            'axisRowPadding': {
                paddingLeft: '1em',
                paddingRight: '1em',
                paddingTop: '.5em' 
            },
            'gridRowContainerPadding': {
                paddingLeft: '1em',
                paddingRight: '1em'
            }, 
            'glyph_background_color': "#f8f8f8", 
            'habit_card_inner_border_inactive': `1px solid ${grey[2]}`, 
            'habit_card_inner_border_active': `1px solid ${grey[4]}`
        },
        "theme_two": {
            'body_background': blue[3], 
            'timeaxis_background': 'none', 
            'timeaxis_border': `none`, 
            'timeaxis_text_normal_low_contrast': grey[5], 
            'timeaxis_text_normal_high_contrast': grey[7], 
            'timeaxis_text_current_low_contrast': grey[2], 
            'timeaxis_text_current_high_contrast': grey[0], 
            'shift_button_color': grey[3], 
            'habitlist_title_color': grey[2], 
            'habitlist_header_border_bottom': 0, // `1px solid ${grey[3]}`
            'left_span': 14, 
            'right_span': 14, 
            'gridRowContainerPadding': {
                paddingTop: 5, 
                paddingRight: 5, 
                paddingBottom: 0, 
                paddingLeft: 5
            }, 
            'glyph_background_color': "#f8f8f8", 
            'habit_card_inner_border_inactive': `1px solid ${grey[2]}`, 
            'habit_card_inner_border_active': `1px solid ${grey[4]}`
        }
    }

    let vars = themes["theme_one"]; 

    const merged = Object.assign(colors, vars); 

    return merged; 

})(); 