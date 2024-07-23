<?php
/*
  This file is part of a child theme called Kadence Child Theme.
  Functions in this file will be loaded before the parent theme's functions.
  For more information, please read
  https://developer.wordpress.org/themes/advanced-topics/child-themes/
*/

// this code loads the parent's stylesheet (leave it in place unless you know what you're doing)

function your_theme_enqueue_styles() {

    $parent_style = 'parent-style';

    wp_enqueue_style( $parent_style, 
      get_template_directory_uri() . '/style.css'); 

    wp_enqueue_style( 'child-style', 
      get_stylesheet_directory_uri() . '/style.css', 
      array($parent_style), 
      wp_get_theme()->get('Version') 
    );
}

add_action('wp_enqueue_scripts', 'your_theme_enqueue_styles');

/*  Add your own functions below this line.
    ======================================== */

// Enqueue the custom script and style for the onboarding page
function enqueue_onboarding_script() {
    if (is_page_template('page-onboarding.php')) {
        wp_enqueue_script('onboarding-script', get_stylesheet_directory_uri() . '/js/onboarding.js', array(), null, true);
        wp_enqueue_style('onboarding-style', get_stylesheet_directory_uri() . '/css/onboarding.css');
    }
}
add_action('wp_enqueue_scripts', 'enqueue_onboarding_script');

// Handle AJAX request to save onboarding data
function save_onboarding_data() {
    // Check for nonce security
    check_ajax_referer('onboarding_nonce', 'security');

    // Get the user ID
    $user_id = get_current_user_id();

    // Get the data from the AJAX request
    $responses = isset($_POST['responses']) ? $_POST['responses'] : array();

    // Save the responses as user meta
    if ($user_id && !empty($responses)) {
        update_user_meta($user_id, 'onboarding_responses', $responses);
        wp_send_json_success('Responses saved successfully.');
    } else {
        wp_send_json_error('Failed to save responses.');
    }
}
add_action('wp_ajax_save_onboarding_data', 'save_onboarding_data');

// Localize script to include AJAX URL and nonce
function localize_onboarding_script() {
    if (is_page_template('page-onboarding.php')) {
        wp_localize_script('onboarding-script', 'onboarding_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('onboarding_nonce')
        ));
    }
}
add_action('wp_enqueue_scripts', 'localize_onboarding_script');

// Create custom post type for Onboarding
function create_onboarding_post_type() {
    register_post_type('onboarding',
        array(
            'labels' => array(
                'name' => __('Onboarding Steps'),
                'singular_name' => __('Onboarding Step')
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'supports' => array('title')
        )
    );
}
add_action('init', 'create_onboarding_post_type');
