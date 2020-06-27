export interface Theme {
    body_background: string,            // the color of the background for the entire app
    table_axes_border: string,          // the border for the habit list and time axis 
    table_axes_background: string,      // the background for the habit list and time axis
    habitlist_card_background: string,  // the background for habit cards    
    habitlist_card_border: string,      // the border for habit cards    
    timeaxis_card_background: string,   // the background for time axis cards 
    timeaxis_card_border: string,       // the border for time axis cards 
    shift_button_color: string, 

    timeaxis_text_normal_low_contrast: string, 
    timeaxis_text_normal_high_contrast: string, 
    timeaxis_text_current_low_contrast: string, 
    timeaxis_text_current_high_contrast: string, 
    habitlist_title_color: string, 
    habitlist_header_border_bottom: string, 
    left_span: number, 
    right_span: number, 
    axisRowPadding: {
        paddingLeft: string,
        paddingRight: string,
        paddingTop: string
    },
    gridRowContainerPadding: {
        paddingLeft: string,
        paddingRight: string
    }, 
    glyph_background_color: string, 
    habit_card_inner_border_inactive: string, 
    habit_card_inner_border_active: string
    
  };