export class Helper {
  static searchChompByType(chomp, filter) {
    let responseList = [];
    Helper.searchChompByType_t(chomp, filter, responseList);
    return responseList;
  }

  static searchChompByType_t(chomp, filter, responseList) {
    for(const [key, value] of Object.entries(filter)) {
      let filterFullfilled = true;

      if(!(key in chomp && value == filter[key])) {
        filterFullfilled = false;
      }
      if(filterFullfilled) {
        responseList.push(chomp);
      }
    }

    let childrenChomps = chomp.childrenChomps;
    for(let i = 0, c = childrenChomps.length; i < c; i++) {
      Helper.searchChompByType_t(childrenChomps[i], filter, responseList);
    }
  }
}