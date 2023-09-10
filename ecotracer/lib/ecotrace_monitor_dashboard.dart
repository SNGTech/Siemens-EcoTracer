import "package:ecotracer/charts/energy_consumption/energy_chart.dart";
import 'package:ecotracer/charts/timing_distribution/td_chart.dart';
import "package:ecotracer/constants/colours.dart";
import "package:flutter/material.dart";

class EcoTracerDashboardWidget extends StatelessWidget {
  // PLACEHOLDER TEST DATA
  final timingDistribution = [75.0, 10.0, 15.0];
  final energyConsumptions = [
    [250.0, 100.0],
    [210.0, 200.0],
    [403.10, 70.0],
    [340.20, 267.9],
    [350.0, 100.0],
    [480.0, 350.0],
    [200.0, 113.0],
    [100.50, 20.45],
    [290.0, 100.0],
    [390.0, 300.0]
  ];

  EcoTracerDashboardWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Container(
            margin: const EdgeInsets.only(bottom: 15, left: 15, right: 15),
            alignment: Alignment.centerLeft,
            child: const Text(
              "Timing Distribution",
              style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: AppColor.brown,
                  fontSize: 20),
            )),
        /***************************[START: TIME DISTRIBUTION HORIZONTAL BAR CHART]***************************/
        RotatedBox(
            quarterTurns: 1,
            child: Container(
                width: 200,
                height: MediaQuery.of(context).size.width - 30,
                margin: const EdgeInsets.symmetric(horizontal: 0),
                padding: const EdgeInsets.only(bottom: 0, top: 10),
                child: TDBarChart(timingDistribution: timingDistribution))),
        Row(
          children: [
            const SizedBox(width: 80),
            Expanded(
              flex: 1,
              child: Container(
                  margin: const EdgeInsets.only(right: 30),
                  child: const Text(
                    "% of Time Taken",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: AppColor.dark,
                        fontSize: 15,
                        fontWeight: FontWeight.w700),
                  )),
            )
          ],
        ),
        /***************************[END: TIME DISTRIBUTION HORIZONTAL BAR CHART]***************************/

        Container(
            margin:
                const EdgeInsets.only(top: 20, bottom: 10, left: 15, right: 15),
            alignment: Alignment.centerLeft,
            child: const Text(
              "Energy Consumption (W)",
              style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: AppColor.brown,
                  fontSize: 20),
            )),

        /***************************[START: ENERGY CONSUMPTION VERTICAL BAR CHART]***************************/

        Container(
            margin: const EdgeInsets.only(bottom: 10, left: 20),
            child: const Row(children: [
              LegendWidget(
                  legend: "Actual", colour: AppColor.statsEnergyConsumption),
              SizedBox(width: 25),
              LegendWidget(legend: "Target", colour: AppColor.statsEnergyTarget)
            ])),
        Container(
            height: 350,
            margin: const EdgeInsets.only(top: 15, left: 15, right: 25),
            child:
                EnergyConsumptionChart(energyConsumptions: energyConsumptions)),
      ],
    );
  }
}

class LegendWidget extends StatelessWidget {
  final Color colour;
  final String legend;

  const LegendWidget({required this.legend, required this.colour, super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(shape: BoxShape.circle, color: colour),
        ),
        const SizedBox(width: 10),
        Text(
          legend,
          style: const TextStyle(
              color: AppColor.dark,
              fontSize: 15,
              fontWeight: FontWeight.normal),
        )
      ],
    );
  }
}
