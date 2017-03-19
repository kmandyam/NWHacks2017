"use strict";

(function(){
	var exposureScore = -40;
	var credibilityScore = 79;

	window.onload = function() {
		calculateInput();
		renderExposureScore();
		renderCredibilityScore();
	}

	function calculateInput() {

	}

	function renderExposureScore() {
		$("#finalscore").text() = exposureScore;
	}

	function renderCredibilityScore() {
		$("#credibility").text() = credibilityScore;
	}
})();
