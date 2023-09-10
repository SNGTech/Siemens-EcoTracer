import 'package:flutter/material.dart';

enum ProcessStatus {
  making(
      statusName: "Making",
      descriptor: "Percentage Completed",
      bgColor: Color(0xFF85ACA5)),
  halted(
      statusName: "Halted",
      descriptor: "Process has been halted by operator",
      bgColor: Color(0xFFAC8585)),
  paused(
      statusName: "Paused",
      descriptor: "Process has been paused by operator",
      bgColor: Color(0xFFACAB85)),
  inQueue(
      statusName: "In Queue",
      descriptor: "Will start after previous process",
      bgColor: Color(0xFF85ACA5));

  const ProcessStatus(
      {required this.statusName,
      required this.descriptor,
      required this.bgColor});

  final String? statusName;
  final String? descriptor;
  final Color? bgColor;

  String? get getStatusName => statusName;
  String? get getDescriptor => descriptor;
  Color? get getBgColor => bgColor;
}

class BatchProcess {
  String? name;
  int? batchNo;
  ProcessStatus? status;

  BatchProcess(String this.name, int this.batchNo, ProcessStatus this.status);

  String? get getName => name;

  int? get getBatch => batchNo;

  ProcessStatus? get getStatus => status;
}
