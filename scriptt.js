const solutions = {
    "Irrigation Efficiency": "Implement efficient irrigation systems, such as drip irrigation or micro-sprinklers, to minimize water waste and ensure that water reaches the roots of plants. Use soil moisture sensors to adjust irrigation schedules and prevent over-irrigation. This approach helps to conserve water and reduce the environmental impact of irrigation.",
    "Rainwater Harvesting": "Set up rain barrels or other collection systems to capture and store rainwater for irrigation and non-potable uses. Use this collected rainwater to water your garden and reduce reliance on municipal water supplies. Ensure that your system is properly maintained and regularly cleaned to avoid contamination and optimize efficiency.",
    "Comparative GWL Analysis":"Analyze groundwater level (GWL) trends over time by comparing historical and current data. This helps in identifying patterns, seasonal variations, and areas of concern, allowing for informed water management decisions.",
    "Urban Planning Support":"Use groundwater data to guide urban planning, ensuring that development projects account for sustainable water usage. Integrating groundwater insights helps in designing infrastructure that minimizes environmental impact and supports long-term water security.",
    "Soil & Land Stability":"Monitor groundwater levels to assess soil and land stability, particularly in areas prone to subsidence or erosion. Maintaining stable groundwater levels can prevent land degradation and protect buildings and infrastructure.",
    "Drinking Water Availability":"Ensure that groundwater resources are managed sustainably to maintain the availability of clean drinking water. Regular monitoring helps to identify potential shortages and mitigate contamination risks.",
    "Soil Moisture Monitoring": "Utilize soil moisture sensors to accurately gauge soil hydration levels and adjust irrigation accordingly. By monitoring moisture levels, you can optimize water use, prevent over-irrigation, and ensure that your plants receive the right amount of water for healthy growth",
    "Proper Well Maintenance": "Regularly inspect and maintain your well to ensure its proper function and prevent issues like contamination or over-extraction. Schedule routine checks, clean the well as needed, and address any problems promptly to ensure a reliable water supply and protect groundwater quality."
};

function showSolution() {
    const select = document.getElementById("problemSelect");
    const solutionContainer = document.getElementById("solutionContainer");
    const solutionText = document.getElementById("solutionText");
    
    const selectedProblem = select.value;
    if (selectedProblem) {
        solutionText.innerText = solutions[selectedProblem];
        solutionContainer.style.display = "block";
    } else {
        solutionContainer.style.display = "none";
    }
}

function showUtility() {
    const selectedUtility = document.getElementById('problemSelect').value;
    const irrigationSection = document.getElementById('irrigationSection');
    const urbanPlanningSection = document.getElementById('urbanPlanningSection');
    const rainwaterHarvestingSection = document.getElementById('rainwaterHarvestingSection');
    const gwlAnalysisSection = document.getElementById('gwlAnalysisSection');
    const soilLandStabilitySection = document.getElementById('soilLandStabilitySection');
    const drinkingWaterAvailabilitySection = document.getElementById('drinkingWaterAvailabilitySection');

    // Hide all sections initially
    irrigationSection.style.display = "none";
    urbanPlanningSection.style.display = "none";
    rainwaterHarvestingSection.style.display = "none";
    gwlAnalysisSection.style.display = "none";
    soilLandStabilitySection.style.display = "none";
    drinkingWaterAvailabilitySection.style.display = "none";

    // Show the relevant section based on the selected utility
    if (selectedUtility === "Irrigation Efficiency") {
        irrigationSection.style.display = "block";
    } else if (selectedUtility === "Urban Planning Support") {
        urbanPlanningSection.style.display = "block";
    } else if (selectedUtility === "Rainwater Harvesting") {
        rainwaterHarvestingSection.style.display = "block";
    } else if (selectedUtility === "Comparative GWL Analysis") {
        gwlAnalysisSection.style.display = "block";
    } else if (selectedUtility === "Soil & Land Stability") {
        soilLandStabilitySection.style.display = "block";
    } else if (selectedUtility === "Drinking Water Availability") {
        drinkingWaterAvailabilitySection.style.display = "block";
    }
}



function calculateAdvisory() {
    const landArea = document.getElementById('landArea').value;
    const groundwaterLevel = document.getElementById('groundwaterLevelIrrigation').value;

    const waterRequiredPerSqFt = 0.623; // Example constant value in liters per sq. foot

    // Calculate total water requirement
    const totalWaterRequired = landArea * waterRequiredPerSqFt;

    // Determine water availability based on groundwater level
    let waterAvailable;
    if (groundwaterLevel < 5) {
        waterAvailable = totalWaterRequired * 0.5;
    } else if (groundwaterLevel >= 5 && groundwaterLevel <= 10) {
        waterAvailable = totalWaterRequired * 0.75;
    } else {
        waterAvailable = totalWaterRequired;
    }

    const additionalWaterNeeded = totalWaterRequired - waterAvailable > 0 ? totalWaterRequired - waterAvailable : 0;

    const irrigationSchedule = (waterAvailable / landArea).toFixed(2);

    let irrigationMethod;
    if (irrigationSchedule <= 0.5) {
        irrigationMethod = 'Drip irrigation is the best method as it conserves water while ensuring proper hydration.';
    } else if (irrigationSchedule <= 1) {
        irrigationMethod = 'Micro-sprinklers would be effective for your irrigation needs.';
    } else {
        irrigationMethod = 'Conventional sprinkler systems may be needed, but consider water-saving techniques.';
    }

    const result = `
        <h3>Irrigation Efficiency Tips</h3>
        <p>Total water required for ${landArea} square feet: <strong>${totalWaterRequired.toFixed(2)} liters/day</strong></p>
        <p>Water available from current groundwater level: <strong>${waterAvailable.toFixed(2)} liters/day</strong></p>
        <p>Additional water required from other sources: <strong>${additionalWaterNeeded.toFixed(2)} liters/day</strong></p>
        <p>Recommended irrigation schedule: <strong>${irrigationSchedule} liters per square foot per day</strong></p>
        <p>Best mode of irrigation: <strong>${irrigationMethod}</strong></p>
    `;
    document.getElementById('advisoryResult').innerHTML = result;
}

function calculateUrbanPlanningSupport() {
    const location = document.getElementById('location').value;
    const developmentType = document.getElementById('developmentType').value;
    const groundwaterLevel = document.getElementById('groundwaterLevelUrban').value;

    let recommendation;

    if (groundwaterLevel < 5) {
        recommendation = `Groundwater levels in ${location} are critically low. It is recommended to avoid large-scale development projects in this area to prevent resource depletion. Consider implementing water-saving infrastructure.`;
    } else if (groundwaterLevel >= 5 && groundwaterLevel <= 10) {
        recommendation = `Groundwater levels in ${location} are moderate. Careful urban planning is required, with a focus on sustainable water management practices. Incorporating green spaces and rainwater harvesting systems is recommended for ${developmentType} development.`;
    } else {
        recommendation = `Groundwater levels in ${location} are stable. Urban development is feasible, but maintaining sustainable water usage practices is still crucial for long-term viability.`;
    }

    const result = `
        <h3>Urban Planning Support for ${location}</h3>
        <p>Development Type: ${developmentType}</p>
        <p>Recommendation: ${recommendation}</p>
    `;
    document.getElementById('urbanPlanningResult').innerHTML = result;
}

function calculateRainwaterHarvesting() {
    const roofArea = document.getElementById('roofArea').value;
    const rainfall = document.getElementById('rainfall').value;
    const currentWaterLevel = document.getElementById('currentWaterLevel').value; // Added for new water level
    const storageCapacity = document.getElementById('storageCapacity').value; // Added for storage capacity

    // Calculate the volume of rainwater harvested (in gallons)
    const rainwaterHarvestingPotential = roofArea * rainfall * 0.623; // 0.623 gallons per square foot per inch of rainfall

    // Convert rainwater harvested to liters (1 gallon = 3.78541 liters)
    const rainwaterHarvestingPotentialLiters = rainwaterHarvestingPotential * 3.78541;

    // Calculate new water level
    const newWaterLevel = Math.min(Number(currentWaterLevel) + rainwaterHarvestingPotentialLiters, Number(storageCapacity));

    const result = `
        <h3>Rainwater Harvesting Potential</h3>
        <p>Total rainwater that can be harvested from a roof area of ${roofArea} square feet with ${rainfall} inches of rainfall: <strong>${rainwaterHarvestingPotential.toFixed(2)} gallons (${rainwaterHarvestingPotentialLiters.toFixed(2)} liters)</strong></p>
        <p>New water level after rainfall: <strong>${newWaterLevel.toFixed(2)} liters</strong></p>
    `;
    document.getElementById('rainwaterHarvestingResult').innerHTML = result;
}

function calculateGWLAnalysis() {
    const currentGWL = parseFloat(document.getElementById('currentGWL').value);
    const historicalGWL = parseFloat(document.getElementById('historicalGWL').value);

    const gwlDifference = currentGWL - historicalGWL;
    let trend;
    if (gwlDifference > 0) {
        trend = 'Groundwater level has risen by';
    } else if (gwlDifference < 0) {
        trend = 'Groundwater level has dropped by';
    } else {
        trend = 'Groundwater level remains the same.';
    }

    const result = `
        <h3>GWL Comparative result : </h3>
        <p>Ground water level at station 1: <strong>${currentGWL} feet</strong></p>
        <p>Ground water level at station 2: <strong>${historicalGWL} feet</strong></p>
        <p>${trend} <strong>${Math.abs(gwlDifference).toFixed(2)} feet</strong></p>
    `;
    document.getElementById('gwlAnalysisResult').innerHTML = result;
}


function calculateSoilLandStability() {
    const currentGWLSoil = document.getElementById('currentGWLSoil').value;
    const soilType = document.getElementById('soilType').value;
    const slopeAngle = document.getElementById('slopeAngle').value;

    let stabilityRisk;

    // Example logic: assess the risk based on groundwater level, soil type, and slope angle
    if (currentGWLSoil > 10 && slopeAngle > 30) {
        stabilityRisk = 'High risk of instability due to high groundwater levels and steep slope.';
    } else if (soilType === 'Clay' && currentGWLSoil < 5) {
        stabilityRisk = 'Moderate risk due to the soil type’s water retention properties and low groundwater level.';
    } else if (slopeAngle < 15 && currentGWLSoil > 5) {
        stabilityRisk = 'Low risk. Soil and slope are stable with current groundwater levels.';
    } else {
        stabilityRisk = 'Risk assessment requires further data, but no immediate concerns.';
    }

    const result = `
        <h3>Soil & Land Stability Assessment</h3>
        <p>Current Groundwater Level: <strong>${currentGWLSoil} feet</strong></p>
        <p>Soil Type: <strong>${soilType}</strong></p>
        <p>Slope Angle: <strong>${slopeAngle} degrees</strong></p>
        <p>Assessment: <strong>${stabilityRisk}</strong></p>
    `;
    document.getElementById('soilLandStabilityResult').innerHTML = result;
}

function calculateDrinkingWaterAvailability() {
    const currentGWLDrinking = document.getElementById('currentGWLDrinking').value;
    const waterDemand = document.getElementById('waterDemand').value;
    const populationServed = document.getElementById('populationServed').value;

    let waterAvailabilityStatus;

    // Example logic: assess the availability based on groundwater level and demand
    const dailyWaterSupply = currentGWLDrinking * 1000; // Hypothetical conversion factor (can be adjusted)
    const totalDailyDemand = waterDemand * populationServed;

    if (dailyWaterSupply > totalDailyDemand) {
        waterAvailabilityStatus = 'Sufficient water is available for the population’s daily needs.';
    } else if (dailyWaterSupply > (totalDailyDemand * 0.75)) {
        waterAvailabilityStatus = 'Water availability is nearing critical levels but still sufficient.';
    } else {
        waterAvailabilityStatus = 'Water shortage. Insufficient water to meet daily needs of the population.';
    }

    const result = `
        <h3>Drinking Water Availability Assessment</h3>
        <p>Current Groundwater Level: <strong>${currentGWLDrinking} feet</strong></p>
        <p>Daily Water Demand: <strong>${waterDemand} liters</strong></p>
        <p>Population Served: <strong>${populationServed}</strong></p>
        <p>Assessment: <strong>${waterAvailabilityStatus}</strong></p>
    `;
    document.getElementById('drinkingWaterAvailabilityResult').innerHTML = result;
}
