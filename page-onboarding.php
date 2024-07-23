<?php
/*
Template Name: Onboarding
*/

get_header(); ?>

<div id="onboarding-container">
  <div id="onboarding-app"></div>
  <button id="continue-btn" class="onboarding-btn">Continuar</button>
  <button id="skip-btn" class="onboarding-btn">Ahora no</button>
</div>

<script>
const dashboardURL = "<?php echo esc_url(home_url('/escritorio')); ?>";
const skipURL = "<?php echo esc_url(home_url('/escritorio')); ?>";
</script>

<?php get_footer(); ?>
