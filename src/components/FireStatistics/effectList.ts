export const effectList = [
    {
        id: '_2TIC_1201_AI1_PV',
        point: [111.4096999303666, 30.55585781581719],
        flyto: [-50, -55, 25],
        maxValue: 75,
        minValue: 40,
    },
    {
        id: '_2LI_1202_AI1_PV',
        type: 'water',
        modelHeight: 0.6,
        modelBottom: 0,
        coordinates: [111.40970785200963, 30.555793347733047,
            111.40975873780519, 30.555760479790532,
            111.409860143919, 30.555876409330377,
            111.40980691257805, 30.55591109045622],
        maxValue: 2700,
        minValue: 1000,
        flyto: [-30, -35, 25]
    },
    {
        id: '_2LI_1205_AI1_PV',
        type: 'circle_water',
        point: [111.40960609887279, 30.55575309783742],
        radius: 1.3,
        modelHeight: 3,
        modelBottom: 2.2,
        maxValue: 3200,
        minValue: 200,
        flyto: [-48, -35, 25],
        waterFrequency: 5000,
        waterAmplitude: 0.1,
        waterAnimationSpeed: 0.01
    }
]