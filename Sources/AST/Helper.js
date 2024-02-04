export class Helper {
  static searchChompByType(chomp, filter) {
    let responseList = [];
    Helper.searchChompByType_t(chomp, filter, responseList);
    return responseList;
  }

  static chompToDictionary(chomp) {
    const dictionary = {};

    Object.keys(chomp).forEach((key) => {
      dictionary[key] = chomp[key];
    });

    return dictionary;
  }

  static searchChompByType_t(chomp, filter, responseList) {
    let chompKeys = Helper.chompToDictionary(chomp);
    let filterFullfilled = true;
    for(const [key, value] of Object.entries(filter)) {
      if(key in chompKeys && value != chompKeys[key]) {
        filterFullfilled = false;
        break;
      }
    }
    if(filterFullfilled) {
      responseList.push(chomp);
    }

    let childrenChomps = chomp.childrenChomps;
    for(let i = 0, c = childrenChomps.length; i < c; i++) {
      Helper.searchChompByType_t(childrenChomps[i], filter, responseList);
    }
  }
}