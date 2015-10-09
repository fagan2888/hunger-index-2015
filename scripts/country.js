// Global chart config
Chart.defaults.global.responsive = true;

// Global Hunger Index score chart
var context = $('#chart-score').get(0).getContext('2d');
var scoreData = {
  labels: ["1990", "1995", "2000", "2005", "2015"],
  datasets: [
  {
    label: "Global hunger index evolution",
    fillColor: "rgba(220,220,220,0.2)",
    strokeColor: "rgba(220,220,220,1)",
    pointColor: "rgba(220,220,220,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(220,220,220,1)",

    data: [{{ score.year1990 }}, {{ score.year1995 }}, 
           {{ score.year2000 }}, {{ score.year2005 }}, 
           {{ score.year2015 }}]
  }],
};
var scoreChart = new Chart(context).Line(scoreData, {
    scaleOverride: true,
    scaleSteps: 6,
    scaleStepWidth: 10,
    scaleStartValue: 5,
    bezierCurve: false 
});

