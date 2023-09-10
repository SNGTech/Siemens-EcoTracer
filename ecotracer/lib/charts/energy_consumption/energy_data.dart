import "package:ecotracer/charts/energy_consumption/energy_bar.dart";
import "package:ecotracer/constants/colours.dart";
import "package:fl_chart/fl_chart.dart";
import "package:flutter/material.dart";

class EnergyBarData {
  final List<double> measuring;
  final List<double> filtering;
  final List<double> brewing;
  final List<double> mixing;
  final List<double> dispensing;
  final List<double> valves;
  final List<double> bottling;
  final List<double> heating;
  final List<double> processing;
  final List<double> labelling;

  final double interval = 100.0;

  EnergyBarData(
      {required this.measuring,
      required this.filtering,
      required this.brewing,
      required this.mixing,
      required this.dispensing,
      required this.valves,
      required this.bottling,
      required this.heating,
      required this.processing,
      required this.labelling});

  List<EnergyBar> barData = [];

  void init() {
    barData = [
      EnergyBar(
          x: 0, y: measuring[0], targetY: measuring[1], label: "Measuring"),
      EnergyBar(
          x: 1, y: filtering[0], targetY: filtering[1], label: "Filtering"),
      EnergyBar(x: 2, y: brewing[0], targetY: brewing[1], label: "Brewing"),
      EnergyBar(x: 3, y: mixing[0], targetY: mixing[1], label: "Mixing"),
      EnergyBar(
          x: 4, y: dispensing[0], targetY: dispensing[1], label: "Dispensing"),
      EnergyBar(x: 5, y: valves[0], targetY: valves[1], label: "Valves"),
      EnergyBar(x: 6, y: bottling[0], targetY: bottling[1], label: "Bottling"),
      EnergyBar(x: 7, y: heating[0], targetY: heating[1], label: "Heating"),
      EnergyBar(
          x: 8, y: processing[0], targetY: processing[1], label: "Processing"),
      EnergyBar(
          x: 9, y: labelling[0], targetY: labelling[1], label: "Labelling")
    ];
  }

  SideTitles getTicks() => SideTitles(
        showTitles: true,
        reservedSize: 40,
        getTitlesWidget: (value, meta) => Container(
          margin: const EdgeInsets.only(right: 10),
          child: Text(
            value % interval == 0 ? value.toInt().toString() : "",
            textAlign: TextAlign.right,
            style: const TextStyle(
                color: Color(0xFFA3A8AF),
                fontSize: 15,
                fontWeight: FontWeight.w500),
          ),
        ),
      );

  SideTitles getLabels() => SideTitles(
      showTitles: true,
      reservedSize: 100,
      getTitlesWidget: (id, meta) => RotatedBox(
            quarterTurns: 1,
            child: Container(
              margin: const EdgeInsets.only(left: 10),
              child: Text(
                barData.firstWhere((e) => e.x == id.toInt()).label,
                textAlign: TextAlign.left,
                style: const TextStyle(
                    color: AppColor.dark,
                    fontSize: 15,
                    fontWeight: FontWeight.w500),
              ),
            ),
          ));
}
