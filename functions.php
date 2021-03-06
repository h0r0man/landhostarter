<?php

  if (!function_exists('landhostarter_setup')) {

    function landhostarter_setup() {
      
      // Let WordPress manage the document title -------------------------------
			
      add_theme_support('title-tag');

			// Enable support for Post Thumbnails on posts and pages -----------------
			
      add_theme_support('post-thumbnails');

			// Enables dynamic navigation --------------------------------------------

      register_nav_menus( array(
				'menu' => 'Menu'
			));

      // Load the assets -------------------------------------------------------
			
			function init_assets() {
        wp_enqueue_style('css-main', get_template_directory_uri() . '/dist/css/main.css', array(), '1.0.0');
        wp_enqueue_script('js-vendor', get_template_directory_uri() . '/dist/js/vendor.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('js-main', get_template_directory_uri() . '/dist/js/main.js', array('jquery'), '1.0.0', true);
			}
			add_action('wp_enqueue_scripts', 'init_assets');
      
      // Content Width ---------------------------------------------------------
      
      if (!isset($content_width)) $content_width = 1280;

      // Soil ------------------------------------------------------------------
      
      get_template_part('inc/soil');
      
    }

  }
  add_action('after_setup_theme', 'landhostarter_setup');
