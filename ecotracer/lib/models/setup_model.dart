class SetupModel {
  double getPercentage({required Map batchData}) {
    return batchData["current_item_count"] / batchData["max_item_count"];
  }

  String getDrinkName({required Map batchData}) {
    return batchData["drink_name"];
  }

  int getCurrentItemCount({required Map batchData}) {
    return batchData["current_item_count"];
  }

  int getMaxItemCount({required Map batchData}) {
    return batchData["max_item_count"];
  }
}
