//helper functions
function filter_function2(array, path) {
  var result = [];
  array.forEach(function (a) {
      var temp = [],
          o = {},
          found = false;

      if (path.indexOf(a.name) !== -1) {
          o.name_to_print = a.name_to_print;
          o.name = a.name;
          if (a.id_valor) {
            o.id_valor = a.id_valor;
            o.id_metodo = a.id_metodo;
            o.metodo = a.metodo;
          }
          found = true;
      }
      if (Array.isArray(a.children)) {
          temp = filter_function2(a.children, path);
          if (temp.length) {
              o.children = temp;
              found = true;
          }
      }
      if (found) {
          result.push(o);
      }
  });
  return result;
};

function minhaBusca(current_Data_a, is_hist) {
  //does search and filters results based on search

  //first generate uncollapsed data
  console.log("current_Data_a");
  console.log(current_Data_a);
  var current_lookup = {}; //relates name to an object
  function mapItJr (node) {
    current_lookup[node.name] = node;
    //recursive on all the children
    node.children && node.children.forEach(mapItJr);
  }
  mapItJr(current_Data_a);
  console.log("current_lookup");
  console.log(current_lookup);
  //https://leaverou.github.io/awesomplete/ autocomplete
  var input, filter, currentNodes, child_names, child_objs, parent_names, parent_objs, child_uniques, parent_uniques;
    input = is_hist ? document.getElementById('search_input_history') : document.getElementById('search_input');
    filter = input.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    currentNodes = current_Data_a;
    child_names = [];
    child_objs = [];
    parent_names = [];
    parent_objs = [];
    child_uniques = [];
    parent_uniques = [];

    //var list of nodes to expand

    if (is_hist === true) {
      list_hist_expandible = [];
      list_hist_expandible_names = [];
    } else {
      list_tree_expandible = [];
      list_tree_expandible_names = [];
    }

    if (!filter) {
      search = false;
      return [[],[],[]];
    } else {
      //1: Pais e Filhos com match são salvos separadamente

      //save parent level and leaf level search in separate arrays
      //leaves should always have all their parents as input for path
      //parent nodes should always have all their children as input for path
      getNameChildMatch = function (obj, child_names, child_objs, parent_names, parent_objs, child_uniques, parent_uniques) {
          if (obj.name_to_print.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(filter) > -1) {
            parent_names.push(obj.name_to_print);
            parent_objs.push(obj);
            parent_uniques.push(obj.name);
          }
          if (obj.children) {
              obj.children.forEach(function (d) {
                  if (d.children) {
                    getNameChildMatch(d, child_names, child_objs, parent_names, parent_objs, child_uniques, parent_uniques);

                  } else {
                    //leaf nodes
                    if (d.name_to_print.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(filter) > -1) {
                      child_names.push(d.name_to_print);
                      child_objs.push(d);
                      child_uniques.push(d.name);
                    }
                  }
              });
          }
      }

      getNameChildMatch(currentNodes, child_names, child_objs, parent_names, parent_objs, child_uniques, parent_uniques);

      var both_names1 = [].concat(child_names).concat(parent_names);
      var both_names = [].concat(child_names);

      var both_names_objs = [].concat(child_objs);

      var both_names_uniques1 = [].concat(child_uniques).concat(parent_uniques);
      var both_names_uniques = [].concat(child_uniques);

      console.log("parent_uniques");
      console.log(parent_uniques);
      //if parent node has any recursive child nodes inside both_names, it should be removed
      console.log("child_uniques");
      console.log(child_uniques);

      var to_add = true;
      function recursiveParentUniquesLookup(par_name, obj) {
        if (obj.children) {
          obj.children.forEach(function(d){
            if (d.children) {
              recursiveParentUniquesLookup(par_name, d);
            }
            if ((d.name !== par_name) && (both_names_uniques1.indexOf(d.name) > -1)) {
              to_add = false;
            }
          });
        }
        if ((obj.name !== par_name) && (both_names_uniques1.indexOf(obj.name) > -1)) {
          to_add = false;
        }
      }

      var new_parent_objs = [];
      var new_parent_uniques = [];
      if (child_uniques.length > 0) {
        for(var i_par in parent_uniques) {
          var this_parent_obj = parent_objs[i_par];
          to_add = true;
          recursiveParentUniquesLookup(this_parent_obj.name, this_parent_obj);
          if (to_add === true) {
            if (this_parent_obj.name) {
              both_names.push(this_parent_obj.name_to_print);
              both_names_uniques.push(this_parent_obj.name)
              both_names_objs.push(this_parent_obj);
              new_parent_objs.push(this_parent_obj);
            }
          }
        }
      } else {
        both_names = [].concat(parent_names);
        both_names_uniques = [].concat(parent_uniques);
        both_names_objs = [].concat(parent_objs);
        new_parent_objs = new_parent_objs.concat(parent_objs);
      }


      // if (child_uniques.length > 0) {
      //   for (var i_par in parent_uniques) {
      //     var this_parent_obj = parent_objs[i_par];
      //     var parent_name = parent_uniques[i_par];
      //     to_add = true;
      //     for (var i_chi in this_parent_obj.children) {
      //       var each_child_obj = this_parent_obj.children[i_chi];
      //       if (both_names_uniques1.indexOf(each_child_obj.name) > -1) {
      //         to_add = false;
      //       }
      //     }
      //     if (to_add === true) {
      //       if (this_parent_obj.name) {
      //         both_names.push(this_parent_obj.name_to_print);
      //         both_names_uniques.push(this_parent_obj.name)
      //         both_names_objs.push(this_parent_obj);
      //         new_parent_objs.push(this_parent_obj);
      //       }
      //     }
      //   }
      // } else {
      //   both_names = [].concat(parent_names);
      //   both_names_uniques = [].concat(parent_uniques);
      //   both_names_objs = [].concat(parent_objs);
      //   new_parent_objs = new_parent_objs.concat(parent_objs);
      // }

      if (both_names.length < 1) {
        search = false;
        return [[],[], []];
      }

      console.log("current_lookup");
      console.log(current_lookup);
      //get parent elements not already in parent_names
      findParents = function(current_name, current_lookup) {
        var search = true;
        var path1 = [];
        var path1_objs = [];
        var path1_objs_name = [];
        while (search) {
          var found = false;
          for (var ind in current_lookup) {
            if (current_lookup[ind].children) {
                current_lookup[ind].children.forEach(function (d) {
                  if (d.name === current_name) {
                    path1.push(current_lookup[ind].name_to_print);
                    path1_objs.push(current_lookup[ind]);
                    path1_objs_name.push(current_lookup[ind].name)
                    found = true;
                    current_name = ind;
                  }
                });
              }
            }
            if (found === false)  {
              break;
            }
        }
        return [path1, path1_objs, path1_objs_name];
      }

      var path = [].concat(both_names);
      var path_objs = [].concat(both_names_objs);
      var path_unique_objs = [].concat(both_names_uniques);

      //add parents for each parent object not already in resultsNameArray
      for (var name in both_names_uniques) {
        var findResults = findParents(both_names_uniques[name], current_lookup);
        var currentParents = findResults[0];
        var currentParentsObjs = findResults[1];
        var currentParentsUniques = findResults[2];
        for (var name2 in currentParentsUniques) {
          if ((path_unique_objs.indexOf(currentParentsUniques[name2]) === -1) && (currentParentsUniques[name2])) {
            path.push(currentParents[name2]);
            path_unique_objs.push(currentParentsUniques[name2])
            path_objs.push(currentParentsObjs[name2]);
            if (is_hist === true) {
              list_hist_expandible.push(currentParents[name2]);
              list_hist_expandible_names.push(currentParentsUniques[name2]);
            } else {
              list_tree_expandible.push(currentParents[name2]);
              list_tree_expandible_names.push(currentParentsUniques[name2]);
            }
          }
        }
      }
      // console.log("list_hist_expandible");
      // console.log(list_hist_expandible);
      // console.log("list_hist_expandible_names");
      // console.log(list_hist_expandible_names);
      //
      //
      // if (is_hist === true) {
      //   for (var name2 in parent_uniques) {
      //     if (list_hist_expandible_names.indexOf(parent_uniques[name2] === -1)) {
      //       list_hist_expandible.push(parent_names[name2]);
      //       list_hist_expandible_names.push(parent_uniques[name2]);
      //     }
      //   }
      // }
      // console.log("list_hist_expandible");
      // console.log(list_hist_expandible);
      // console.log("list_hist_expandible_names");
      // console.log(list_hist_expandible_names);

      var path2 = path.slice();;
      var path_objs2 = path_objs.slice();;
      var path_unique_objs2 = path_unique_objs.slice();;

      //if parent node is unique, its children should be included in the list
      //if parent node is unique, its children should be RECURSIVELY included in the list
      //new_parent_objs

      findChildren = function (obj) {
        if (path_unique_objs.indexOf(obj.name) === -1) {
          path.push(obj.name_to_print);
          path_unique_objs.push(obj.name);
        }
        if (obj.children) {
          obj.children.forEach(function (d) {
            if (path_unique_objs.indexOf(d.name) === -1) {
              path.push(d.name_to_print);
              path_unique_objs.push(d.name);
            }
            if (d.children) {
              findChildren(d);
            } else  {
              if (path_unique_objs.indexOf(d.name) === -1) {
                path.push(d.name_to_print);
                path_unique_objs.push(d.name);
              }
            }
          });
        } else  {
          if (path_unique_objs.indexOf(obj.name) === -1) {
            path.push(obj.name_to_print);
            path_unique_objs.push(obj.name);
          }
        }
      };

      for (var each_c in new_parent_objs) {
        var current_obj = new_parent_objs[each_c];
        if (current_obj) {
          var children_list = current_obj.children;
          for (var each_cc in children_list) {
            var current_children = children_list[each_cc];
            if ((path_unique_objs.indexOf(current_children.name) === -1) && (current_children)) {
              findChildren(current_children);
              path_objs.push(current_children);
            }
          }
        }
      }
      console.log("path");
      console.log(path);
      search = true;
      return [path, path_objs, path_unique_objs];
    }
};

var validity = function(d, this_date) {
  var properties = data2[this_date];
  for(k in properties) {
    if ((d) && (properties[k].id == d.id_valor)) {
      var verification = properties[k].valid;
      if (verification === false) {
        return "falso";
      } else {
        return "nao";
      }
    }
  }
  return false;
};

function minhaFiltragem(current_Data, is_hist) {
  var to_use_data_obj;
  if (is_hist === true) {
    to_use_data_obj = objects_exam_dates;
  } else {
    to_use_data_obj = objects_exam_dates_hist;
  }
  //get all invalid leave nodes

  //first generate uncollapsed data
  var current_lookup = {}; //relates name to an object
  function mapItJr (node) {
    current_lookup[node.name] = node;
    //recursive on all the children
    node.children && node.children.forEach(mapItJr);
  }
  mapItJr(current_Data);

  getInvalidLeaves = function (obj, child_names, child_objects, child_unique_names) {
      var obj_date = to_use_data_obj[obj.name];
      if (validity(obj, obj_date) === "falso") {
        child_names.push(obj.name_to_print);
        child_objects.push(obj);
        child_unique_names.push(obj.name);
      }
      if (obj.children) {
          obj.children.forEach(function (d) {
              if (d.children) {
                getInvalidLeaves(d, child_names, child_objects, child_unique_names);
              } else {
                var d_date = to_use_data_obj[d.name];
                if (validity(d, d_date) === "falso") {
                  child_names.push(d.name_to_print);
                  child_objects.push(d);
                  child_unique_names.push(d.name);
                }
              }
          });
      }
    };

  var resultsNameArray = [];
  var resultsObjArray = [];
  var resultsUniqueNameArray = [];

  getInvalidLeaves(current_Data, resultsNameArray, resultsObjArray, resultsUniqueNameArray);
  //get parents of invalid nodes
  findParents = function(current_name, current_lookup) {
    var search = true;
    var path1 = [];
    var path1_objs = [];
    var path1_objs_name = [];
    while (search) {
      var found = false;
      for (var ind in current_lookup) {
        if (current_lookup[ind].children) {
            current_lookup[ind].children.forEach(function (d) {
              // if (d.name_to_print === current_name) {
              if (d.name === current_name) {
                path1.push(current_lookup[ind].name_to_print);
                path1_objs.push(current_lookup[ind]);
                path1_objs_name.push(current_lookup[ind].name)
                found = true;
                current_name = ind;
              }
            });
          }
        }
        if (found === false)  {
          break;
        }
    }
    return [path1, path1_objs, path1_objs_name];
  }

  var path = [].concat(resultsNameArray);
  var path_objs = [].concat(resultsObjArray);
  var path_names = [].concat(resultsUniqueNameArray);

  //add parents for each parent object not already in resultsNameArray
  // for (var name in resultsNameArray) {
  for (var name in resultsUniqueNameArray) {
    var resultsParents = findParents(resultsUniqueNameArray[name], current_lookup);
    var currentParents = resultsParents[0];
    var currentParentsObjs = resultsParents[1];
    var currentParentsObjsName = resultsParents[2];
    path = path.concat(currentParents);
    path_objs = path_objs.concat(currentParentsObjs);
    path_names = path_names.concat(currentParentsObjsName);
  }

  var final_path = [];
  var final_path_objs = [];
  var final_path_objs_names = [];

  for (var ind_pat in path) {
    if (final_path_objs_names.indexOf(path_objs[ind_pat]) === -1) {
      final_path.push(path[ind_pat]);
      final_path_objs.push(path_objs[ind_pat]);
      final_path_objs_names.push(path_objs[ind_pat].name);
    }
  }
  path = final_path;
  path_objs = final_path_objs;
  path_names = final_path_objs_names;
  //filter and rendering json object
  if (path_names.length < 1) {
    return [[],[],[]];
  } else {
    return [path, path_objs, path_names];
  }
};

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function prepareData(data_orig) {
  function isNumber(v) {
    return v != null && !isNaN(v);
  }
  function norm(v, min, max) {
    return 2 * (v - min) / (max - min) - 1;
  }
  function normd(d) {
    return norm(d.value, d.min, d.max);
  }

  // if (!Array.prototype.last) {
  //   Array.prototype.last = function() {
  //     return this[this.length - 1];
  //   };
  // }

  // filter: numeric value,min,max
  console.log("data_orig");
  console.log(data_orig);
  console.log(data_orig.filter(d => [d.value, d.min, d.max].every(isNumber)));
  let e_data = data_orig
    .filter(d => [d.value, d.min, d.max].every(isNumber))
    .sort((a, b) => d3.ascending(a.id_valor, b.id_valor));

  // augment w/ new fields
  var e = 0;
  e_data.forEach(d => {
    d.val_norm = normd(d);
    d.val_norm_abs = Math.abs(d.val_norm);
    d.in_range = d.val_norm_abs <= 1;
    // d.exam_name = d.descr_valor.split("|").last();
    d.exam_name = d.descr_valor.split("|")[d.descr_valor.split("|").length - 1];
    d.dot_color = d.in_range ? "green" : "red";
    d.text_color = d.in_range ? "black" : "red";
    d.tooltip = `${d.exam_name}: ${d.value} [${d.min} a ${d.max}]`;
    d.order_y = e;
    d.found_s = false;
    e++;
  });
  return e_data;
}

let childColor = function(d) {
  var this_date = objects_exam_dates[d.name];
  if (!this_date) {
    this_date = objects_exam_dates_hist;
  }
  var properties = data2[this_date];
  for(k in properties) {
    if(properties[k].id == d.id_valor) {
      var verification = properties[k].valid;
      if (verification === false) {
          return "red_c";
        } else if (verification === null) {
          return "yellow_c";
        } else if (verification === true) {
          return "green_c";
        } else {
          return "yellow_c";
        }
      }
    }
};

//helper functions check colors for a parent node
let parentColor = function(obj) {
  if (obj.children) {
    obj.children.forEach(function (c) {
        if (c.children) {
          parentColor(c);
        } else {
          var color = childColor(c);
          if (color === "red_c") {
            new_color = "red_c";
          }
        }
    });
  } else {
    var color = childColor(obj);
    if (color === "red_c") {
      new_color = "red_c";
    }
  }
};

var MyRequestsCompleted = (function() {
    var numRequestToComplete, requestsCompleted, callBacks, singleCallBack;

    return function(options) {
        if (!options) options = {};

        numRequestToComplete = options.numRequest || 0;
        requestsCompleted = options.requestsCompleted || 0;
        callBacks = [];
        var fireCallbacks = function() {
            // alert("we're all complete");
            for (var i = 0; i < callBacks.length; i++) callBacks[i]();
        };
        if (options.singleCallback) callBacks.push(options.singleCallback);

        this.addCallbackToQueue = function(isComplete, callback) {
            if (isComplete) requestsCompleted++;
            if (callback) callBacks.push(callback);
            if (requestsCompleted == numRequestToComplete) fireCallbacks();
        };
        this.requestComplete = function(isComplete) {
            if (isComplete) requestsCompleted++;
            if (requestsCompleted == numRequestToComplete) fireCallbacks();
        };
        this.setCallback = function(callback) {
            callBacks.push(callBack);
        };
    };
})();

let arrayToAjax = function(examData) {
  //get current exam ids and values
  //uncollapse data object
  var full_nodes_map2 = {};
  function untangleNodes_b (node) {
    full_nodes_map2[node.name] = node;
    //recursive on all the children
    node.children && node.children.forEach(untangleNodes_b);
  }
  untangleNodes_b(data);

  var data_object_array = [];
  function findChildrenGetIdValue(obj, currentDate) {
    if (obj.children)  {
      obj.children.forEach(function(d) {
        if (d.children) {
          findChildrenGetIdValue(d, currentDate);
        } else {
          var data_object = {};
          data_object["id"] = d["id_valor"];
          if ( (isNaN(d["valor"] * 1) !== true)  && (d["valor"] * 1 !== 0) ) {
            data_object["value"] = d["valor"] * 1;
          } else {
            data_object["value"] = null;
          }
          data_object_array.push(data_object);
        }
      });
    } else {
      var data_object = {};
      data_object["id"] = obj["id_valor"];
      // if (obj["valor"]) {
      if ( (isNaN(obj["valor"] * 1) !== true)  && (obj["valor"] * 1 !== 0) ) {
        data_object["value"] = obj["valor"] * 1;
      } else {
        data_object["value"] = null;
      }
      data_object_array.push(data_object);
    }
  }

  for (var e_obj in full_nodes_map2) {
    if (full_nodes_map2.hasOwnProperty(e_obj)) {
      if (full_nodes_map2[e_obj]["name"].indexOf("Exam_Date") > -1) {
        var new_date = full_nodes_map2[e_obj]["name"].split("_")[0];
        if (new_date === examData) {
          findChildrenGetIdValue(full_nodes_map2[e_obj], new_date);
          return data_object_array;
        }
      }
    }
  }
}

//load all data
var hierarchy = d3.hierarchy;
var select = d3.select;
var div_tool = d3.select("body").append("div")
  .attr("id", "tooltip_this")
  .attr("class", "tooltip_a focus-out-tooltip-div");

let slideIndex = 1;
let group_data;
let data;
let oldData;
let original_Data;
let current_Data;
let lookup;

let history_data;
let current_HistData;
let original_HistData;
let hist_lookup;

let data2 = {};
let eagle_data;

let parent_object_counts = {};
let parent_object_invalid_counts = {};
let hist_parent_object_counts = {};
let hist_parent_object_invalid_counts = {};

let data_image_links = {};
// let currentSexa = "M";
let currentSexa;
// let birthDataa = "19660702";
let birthDataa;
let examDatas = [];
let exam_ids = [];
let exam_values = [];
let image_ajax_success;
let filtering_active = false;
let filtering_active_hist = false;
let new_data_rules;

let objects_exam_dates = {};
let objects_exam_dates_hist = {};
//tree generation functions
let tree_margin;
let tree_do_width;
let tree_do_height;
let tree_width;
let tree_height;
let tree_barWidth;
let tree_i;
let tree_duration;
var tree;
let tree_used_data;
let tree_root;
let tree_svg;
let tree_clicked_bool = false;
let tree_last_clicked;
var tree_connector;
var tree_collapse;
var tree_collapseLevel;
var tree_collapseSpecific;
var tree_mkBox;
var tree_mkBox2;
var tree_click;
var tree_hover;
var tree_unhover;
var tree_update;
var tree_setWindowClickListener;
var focusedElement = null;

function draw_svg_tree(data) {

  tree_connector = function (d) {
            return "M" + d.parent.y + "," + d.parent.x
                + "V" + d.x + "H" + d.y;
        };

  tree_collapse = function (d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(tree_collapse);
                d.children = null;
            }
        };

  tree_expand = function (d) {
          // console.log("tree_expanding...");
          var children = (d.children)?d.children:d._children;
          if (d._children) {
            d.children = d._children;
            d._children = null;
          }
          if(children) {
            children.forEach(tree_expand);
          }
        };

  tree_collapseLevel = function (d) {
          if (d.children && d.depth > 1) {
            d._children = d.children;
            d._children.forEach(tree_collapseLevel);
            d.children = null;
          } else if (d.children) {
            d.children.forEach(tree_collapseLevel);
          }
        };

  tree_collapseSpecific = function (d) {
          if (d.children && list_tree_expandible_names.indexOf(d.data.name) === -1) {
          // if (d.children && list_tree_expandible.indexOf(d.data.name_to_print) === -1) {
            d._children = d.children;
            d._children.forEach(tree_collapseSpecific);
            d.children = null;
          } else if (d.children) {
            d.children.forEach(tree_collapseSpecific);
          }
        };

  tree_mkBox = function(g, text) {
          var dim = text.node().getBBox();
            g.insert("rect", "text")
            // .attr("class", "newtooltip_rect")
            .attr("x", dim.x)
            .attr("y", dim.y)
            .style('fill', 'white')
            .attr("filter", "url(#tree-mid-sepia)")
            .attr("width", dim.width)
            .attr("height", dim.height);
        }

  tree_hover = function(d) {
            if (!d.children) {
              var print_text_line1 = "";
              var print_text_line2 = "";
              var this_exam_date = objects_exam_dates[d.data.name];
              for (var i = 0; i < data2[this_exam_date].length; i++) {
                if (data2[this_exam_date][i].id) {
                  if (data2[this_exam_date][i].id === d.data.id_valor) {
                    if (data2[this_exam_date][i].min !== null && typeof(data2[this_exam_date][i].min) != 'undefined') {
                      print_text_line1 =  "Método: " + d.data.metodo + "."
                      print_text_line2 = "Ref: " + data2[this_exam_date][i].min + " a " + data2[this_exam_date][i].max + ".";
                    } else {
                      print_text_line1 =  "Método: " + d.data.metodo + "."
                      print_text_line2 = "Ref: Sem referência.";
                    }
                  }
                }
              }
              var coordinates = [0, 0];
              coordinates = d3.mouse(this);
              var x_coord = coordinates[0];
              var y_coord = coordinates[1];
                // D3 v4
              var x_coord = d3.event.pageX - document.getElementById('doctor').getBoundingClientRect().x + 10
              var y_coord = d3.event.pageY - document.getElementById('doctor').getBoundingClientRect().y + 10
                var nodeSelection = d3.select('#doctor-svg')
              .insert('g')
                .attr('id', 'tree_current_tooltip')
                // .attr("transform", "translate(" + (d3.mouse(this)[0] + 5) + " , " + (d3.mouse(this)[1] + 20) + ")") //previous
                .attr("transform", "translate(" + (x_coord - $(window).scrollLeft()) + " , " + (y_coord - $(window).scrollTop()) + ")")
                .attr('class', 'newtooltip')
                .attr("filter", "url(#tree-mid-sepia)")
                ;

                var this_font_size = 15;
                var this_text = nodeSelection
                .append('text')
                .attr('x', "0")
                .attr('y', "0")
                .attr('font-size', this_font_size)
                ;

                var tspan1 = this_text.append('tspan')
                .attr('x', "0")
                .attr("dy", this_font_size)
                .attr("dx", "0")
                .text(print_text_line1)
                ;
                if (print_text_line2) {
                  var tspan2 = this_text.append('tspan')
                  .attr('x', "0")
                  .attr("dy", this_font_size)
                  .attr("dx", "0")
                  .text(print_text_line2)
                  ;
                }
                tree_mkBox(nodeSelection ,this_text);
            }
        };

  tree_unhover = function(d) {
          d3.select("#tree_current_tooltip").remove(); //removes element
        };

  tree_setWindowClickListener = function(e) {
          console.log("Clicked!");
          if (e.target !== focusedElement) {
            tree_clicked_bool = false;
            tree_last_clicked.attr('filter', null);
            tree_last_clicked = null;
            focusedElement = null;
            d3.select("#tree_highlight_rect").remove();
            div_tool.classed("focus-out-tooltip-div", true)
            .classed("focus-in-tooltip-div", false)
            ;
            window.removeEventListener('click', tree_setWindowClickListener);
          }
        }

  tree_mkBox2 = function(g, text) {
          var dim = text.node().getBBox();
            g.insert("rect", "text")
            .attr("id", "tree_highlight_rect")
            // .attr("class", "newtooltip_rect")
            .attr("x", dim.x)
            .attr("y", dim.y)
            .style('fill', 'yellow')
            // .attr("filter", "url(#mid-sepia)")
            .attr("width", dim.width)
            .attr("height", dim.height);
        }

  tree_click = function (d) {
            d3.select("#tree_highlight_rect").remove();
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else {
                d.children = d._children;
                d._children = null;
                if (tree_clicked_bool === false) {
                //tooltip for whole node
                var current_date = objects_exam_dates[d.data.name];
                if (data_image_links[current_date][d.data.id_valor - 1]) {
                  document.getElementById('loadingDiv').classList.remove('d-none');
                  var img_link = data_image_links[current_date][d.data.id_valor - 1].ref_png;
                  div_tool.classed("focus-out-tooltip-div", false)
                    .classed("focus-in-tooltip-div", true)
                    ;
                  // d3.select(this).attr("filter", "url(#highlight-bright)");
                  tree_last_clicked = d3.select(this);
                  var tree_last_clicked_text = d3.select(tree_last_clicked["_groups"][0][0].children[1])
                  // console.log(tree_last_clicked);
                  // console.log(d3.select(tree_last_clicked["_groups"][0][0].children[1]));
                  tree_mkBox2(tree_last_clicked, tree_last_clicked_text);
                  // console.log(l)
                  var parent_x_pos = this.getBoundingClientRect().left + (this.getBoundingClientRect().width / 1.5);
                  parent_x_pos = parent_x_pos +  $(window).scrollLeft();
                  var parent_y_pos = this.getBoundingClientRect().top +  this.getBoundingClientRect().height;
                  parent_y_pos = parent_y_pos +  $(window).scrollTop();
                  div_tool.html("<img class='image-tool' onload='showLoadingDiv()' src='" + img_link + "' alt=''>")
                    .style("left", (parent_x_pos) + "px")
                    .style("top", (parent_y_pos) + "px");
                  last_focus = true;
                  focusedElement = d3.event.target;
                  window.addEventListener('click', tree_setWindowClickListener);
                  tree_clicked_bool = true;
                }
              } else {
                tree_last_clicked.attr('filter', null);
                tree_last_clicked = null;
                focusedElement = null;
                d3.select("#tree_highlight_rect").remove();
                div_tool.classed("focus-out-tooltip-div", true)
                .classed("focus-in-tooltip-div", false)
                ;
                window.removeEventListener('click', tree_setWindowClickListener);
                tree_clicked_bool = false;
              }
            }
            tree_update(d);
        };

  tree_update = function (source) {
            tree_width = 800;
            // Compute the new tree layout.
            var tree_nodes = tree(tree_root);
            var tree_nodesSort = [];
            tree_nodes.eachBefore(function (n) {
                tree_nodesSort.push(n);
            });
            var def = 15;
            // console.log(viewport().width);
            // if (viewport().width > 1700) {
            //   def = 20;
            // }
            // if (viewport().width > 1900) {
            //   def = 26;
            // }
            var tree_barHeight = def;
            tree_height = Math.max(500, tree_nodesSort.length * tree_barHeight + tree_margin.top + tree_margin.bottom) + 500;
            var tree_links = tree_nodesSort.slice(1);
            // Compute the "layout".
            tree_nodesSort.forEach(function (n, i) {
                n.x = i * tree_barHeight;
            });
            // d3.select('svg').transition()
            d3.select('#doctor-svg').transition()
                .duration(tree_duration)
                .attr("height", tree_height);
            // Update the nodes…
            var tree_node = tree_svg.selectAll('g.node')
                .data(tree_nodesSort, function (d) {
                return d.id || (d.id = ++tree_i);
            });
            // Enter any new nodes at the parent's previous position.
            var tree_nodeEnter = tree_node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', function () {
                return 'translate(' + source.y0 + ',' + source.x0 + ')';
            })
                .on('click', tree_click)
                // .on('click', function(d) {click(this);})
                // clicked_bool = false
                .on('mouseover', tree_hover)
                .on('mouseout', tree_unhover)
                ;

            tree_nodeEnter.append('circle')
                .attr('r', 1e-6)
                .attr("class", function(d) {
                  if (d.data.id_valor) { //se no folha
                    var final_class = childColor(d.data);// + " tooltip";
                    return final_class;
                  } else { //se no pai, checar validez dos nos filhos.
                    var new_color = "fill";
                    return new_color;
                  }
                })
                .style("cursor", "pointer")
                .on('click', function(d){
                  if (!d.children && data_image_links[d.data.id_valor - 1]) {
                    document.getElementById('loadingDiv').classList.remove('d-none');
                    var img_link = data_image_links[d.data.id_valor - 1].ref_png;
                    div_tool.classed("focus-out-tooltip-div", false)
                      .classed("focus-in-tooltip-div", true)
                      ;
                    var parent_x_pos = this.parentNode.getBoundingClientRect().left + (this.parentNode.getBoundingClientRect().width / 1.5);
                    parent_x_pos = parent_x_pos +  $(window).scrollLeft();
                    var parent_y_pos = this.parentNode.getBoundingClientRect().top +  this.parentNode.getBoundingClientRect().height;
                    parent_y_pos = parent_y_pos +  $(window).scrollTop();
                    div_tool.html("<img class='image-tool' onload='showLoadingDiv()' src='" + img_link + "' alt=''>")
                      .style("left", (parent_x_pos) + "px")
                      .style("top", (parent_y_pos) + "px");
                    last_focus = true;
                  }
                })
                .on('focusout', function(d) {
                  if (!d.children) {
                    div_tool.classed("focus-out-tooltip-div", true)
                    .classed("focus-in-tooltip-div", false)
                    ;
                  }
                })
                ;
            var tree_nodeTextEnter = tree_nodeEnter.append('text')
                .attr("class", "nodetext1")
                .attr('x', function (d) {
                return d.children || d._children ? 10 : 10;
                })
                .attr('dy', '.35em')
                .attr('text-anchor', function (d) {
                return d.children || d._children ? 'start' : 'start';
                })
                .style('fill-opacity', 1e-6)
                ;

            tree_nodeTextEnter.append("tspan")
            // nodeEnter.append("text")
                .attr("class", "nodetext2")
                // .attr("class", "nodetspan0")
                .style("fill", "black")
                .text(function (d) {
                  if (d.data.children) {
                    // return d.data.name.split("_")[d.data.name.split("_").length - 1] + " (";
                    return d.data.name_to_print + " (";
                  } else {
                    return d.data.name_to_print;
                  }
                })
                .style('fill-opacity', 1e-6)//;
                ;
            tree_nodeTextEnter.append("tspan")
            // nodeEnter.append("text")
                // .attr("class", "nodetspan1")
                .attr("class", "nodetext3")
                .style("fill", function(d) {
                  if (d.data.children) {
                    var number_invalids = parent_object_invalid_counts[d.data.name];
                    if (number_invalids > 0) {
                      return "red";
                    }
                  }
                  return "black";
                })
                .text(function (d) {
                  if (d.data.children) {
                    var number_invalids = parent_object_invalid_counts[d.data.name];
                    if (number_invalids === 0) {
                      return "";
                    }
                    return number_invalids;
                  }
                  return "";
                })
                .style('fill-opacity', 1e-6)//;
                ;
            tree_nodeTextEnter.append("tspan")
            // nodeEnter.append("text")
                // .attr("class", "nodetspan2")
                .attr("class", "nodetext4")
                .style("fill", "black")
                .text(function (d) {
                  if (d.data.children) {
                    var number_invalids = parent_object_invalid_counts[d.data.name];
                    var number_leaves = parent_object_counts[d.data.name];
                    if (number_invalids === 0) {
                      return number_leaves + ")";
                    }
                    return "/" + number_leaves + ")";
                  }
                  return "";
                })
                .style('fill-opacity', 1e-6)//;
                ;

            // Transition nodes to their new position.
            var tree_nodeUpdate = tree_node.merge(tree_nodeEnter)
                .transition()
                .duration(tree_duration);
            tree_nodeUpdate
                .attr('transform', function (d) {
                return 'translate(' + d.y + ',' + d.x + ')';
            });
            tree_nodeUpdate.select('circle')
                .attr('r', 4.5)
                .attr("class", function(d) {
                  if (d.data.id_valor) { //se no folha
                    var final_class = childColor(d.data); // + " tooltip";
                    return final_class;
                  } else { //se no pai, checar validez dos nos filhos.
                    var new_color = "fill";
                    return new_color;
                  }
                });

            tree_nodeUpdate.select('text.nodetext1')
                    .style('fill-opacity', 1);
            tree_nodeUpdate.select('tspan.nodetext2')
                    .text(function (d) {
                      if (d.data.children) {
                        // return d.data.name.split("_")[d.data.name.split("_").length - 1] + " (";
                        return d.data.name_to_print + " (";
                      } else {
                        return d.data.name_to_print;
                      }
                    })
                    .style('fill-opacity', 1);
            tree_nodeUpdate.select('tspan.nodetext3')
                    .text(function (d) {
                      if (d.data.children) {
                        var number_invalids = parent_object_invalid_counts[d.data.name];
                        if (number_invalids === 0) {
                          return "";
                        }
                        return number_invalids;
                      }
                      return "";
                    })
                    .style('fill-opacity', 1);
            tree_nodeUpdate.select('tspan.nodetext4')
                    .text(function (d) {
                      if (d.data.children) {
                        var number_invalids = parent_object_invalid_counts[d.data.name];
                        var number_leaves = parent_object_counts[d.data.name];
                        if (number_invalids === 0) {
                          return number_leaves + ")";
                        }
                        return "/" + number_leaves + ")";
                      }
                      return "";
                    })
                    .style('fill-opacity', 1);
            // Transition exiting nodes to the parent's new position (and remove the nodes)
            var tree_nodeExit = tree_node.exit().transition()
                .duration(0);
                // .duration(tree_duration);
            tree_nodeExit
                .attr('transform', function (d) {
                // console.log(d.data.name_to_print);
                return 'translate(' + source.y + ',' + source.x + ')';
            })
                .remove();
            tree_nodeExit.select('circle')
                .attr('r', 1e-6);
            tree_nodeExit.select('text')
                .style('fill-opacity', 1e-6);
            // Update the links…
            var tree_link = tree_svg.selectAll('path.link')
                .data(tree_links, function (d) {
                var id = d.id + '->' + d.parent.id;
                return id;
            });
            // Enter any new links at the parent's previous position.
            var tree_linkEnter = tree_link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', function (d) {
                var o = { x: source.x0, y: source.y0, parent: { x: source.x0, y: source.y0 } };
                return tree_connector(o);
            });
            // Transition links to their new position.
            tree_link.merge(tree_linkEnter).transition()
                .duration(tree_duration)
                .attr('d', tree_connector);
            // // Transition exiting nodes to the parent's new position.
            tree_link.exit().transition()
                .duration(tree_duration)
                .attr('d', function (d) {
                var o = { x: source.x, y: source.y, parent: { x: source.x, y: source.y } };
                return tree_connector(o);
            })
                .remove();
            // Stash the old positions for transition.
            tree_nodesSort.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        };

  tree_margin = { top: 20, right: 10, bottom: 20, left: 10 };
  tree_do_width = $('#doctor-tree').width() > 0 ? $('#doctor-tree').width() : $('#doctor-tree').width();
  tree_do_height = $('body').height();
  tree_width = 1000 - tree_margin.right - tree_margin.left;
  tree_height = 2800 - tree_margin.top - tree_margin.bottom;

  tree_barWidth = tree_width * .8;
  tree_i = 0;
  tree_duration = 750;
  tree = d3.tree().size([tree_width, tree_height]);
  tree = d3.tree().nodeSize([0, 30]);
  // var used_data = initialDataAdjust(data);
  tree_used_data = data;
  tree_root = tree(hierarchy(tree_used_data));
  // var root = tree(hierarchy(original_Data));
  tree_root.each(function (d) {
      d.name_to_print = d.id; //transferring name to a name variable
      d.id = tree_i; //Assigning numerical Ids
      tree_i++;
  });
  tree_root.x0 = tree_root.x;
  tree_root.y0 = tree_root.y;
  var myNode = document.getElementById('doctor-svg');
  if (myNode) {
    myNode.parentNode.removeChild(myNode);
  }
  tree_svg = d3.select('#doctor-tree').append('svg')
      .attr("id", "doctor-svg")
      .attr('width', tree_width + tree_margin.right + tree_margin.left)
      .attr('height', tree_height + tree_margin.top + tree_margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + tree_margin.left + ',' + tree_margin.top + ')');

  //create sepia filter
  // var defs = svg.append('defs');
  //https://stackoverflow.com/questions/41986812/svg-sepia-filter-effect-mid-tones-only
  var tree_sepia_filter = d3.select('#doctor-svg').insert('filter')
  .attr('id','tree-mid-sepia')
  .attr('color-interpolation-filters', 'sRGB')
  ;
  tree_sepia_filter.append("feColorMatrix")
  .attr("type", "matrix")
  .attr("result", "tree-sepia-clip")
  .attr("values", "0.39 0.769 0.189 0 0  0.349 0.686 0.168 0 0  0.272 0.534 0.131 0 0  0 0 0 1 0")
  ;
  tree_sepia_filter.append("feComposite")
  .attr("operator", "over")
  .attr("in", "tree-sepia-clip")
  ;

  var tree_highlight_filter = d3.select('#doctor-svg').insert('filter')
  .attr('id', 'tree-highlight-bright')
  .attr('color-interpolation-filters', 'sRGB')
  ;
  tree_highlight_filter.append("feColorMatrix")
  .attr('type', 'matrix')
  .attr("result", "tree_highlight_this")
  .attr("values", "1.2 0.2 0.2 0 0  0.2 1.2 0.2 0 0  0.2 0.2 1.2 0 0  0 0 0 1 0")
  ;
  tree_highlight_filter.append("feComposite")
  .attr("operator", "over")
  .attr("in", "tree_highlight_this")
  ;

  tree_root.children.forEach(tree_collapseLevel);
  tree_update(tree_root);
}
//tree generation functions
let hist_margin;
let hist_do_width;
let hist_do_height;
let hist_width;
let hist_height;
let hist_barWidth;
let hist_i;
let hist_duration;
var hist_tree;
let hist_used_data;
let hist_root;
let hist_svg;
let hist_clicked_bool = false;
let hist_last_clicked;
var hist_connector;
var hist_collapse;
var hist_collapseLevel;
var hist_collapseSpecific;
var hist_mkBox;
var hist_mkBox2;
var hist_click;
var hist_hover;
var hist_unhover;
var hist_update;
var hist_setWindowClickListener;

function draw_svg_hist(data) {

  hist_connector = function (d) {
            return "M" + d.parent.y + "," + d.parent.x
                + "V" + d.x + "H" + d.y;
        };

  hist_collapse = function (d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(hist_collapse);
                d.children = null;
            }
        };

  hist_expand = function (d) {
          // console.log("tree_expanding...");
          var children = (d.children)?d.children:d._children;
          if (d._children) {
            d.children = d._children;
            d._children = null;
          }
          if(children) {
            children.forEach(hist_expand);
          }
        };

  hist_collapseLevel = function (d) {
          if (d.children && d.depth > 1) {
            d._children = d.children;
            d._children.forEach(hist_collapseLevel);
            d.children = null;
          } else if (d.children) {
            d.children.forEach(hist_collapseLevel);
          }
        };

  hist_collapseSpecific = function (d) {
          if (d.children && list_hist_expandible_names.indexOf(d.data.name) === -1) {
          // if (d.children && list_tree_expandible.indexOf(d.data.name_to_print) === -1) {
            d._children = d.children;
            d._children.forEach(hist_collapseSpecific);
            d.children = null;
          } else if (d.children) {
            d.children.forEach(hist_collapseSpecific);
          }
        };

  hist_mkBox = function(g, text) {
          var dim = text.node().getBBox();
            g.insert("rect", "text")
            // .attr("class", "newtooltip_rect")
            .attr("x", dim.x)
            .attr("y", dim.y)
            .style('fill', 'white')
            .attr("filter", "url(#hist-mid-sepia)")
            .attr("width", dim.width)
            .attr("height", dim.height);
        }

  hist_hover = function(d) {
            if (!d.children) {
              var print_text_line1 = "";
              var print_text_line2 = "";
              var this_exam_date = objects_exam_dates_hist[d.data.name];
              for (var i = 0; i < data2[this_exam_date].length; i++) {
                if (data2[this_exam_date][i].id) {
                  if (data2[this_exam_date][i].id === d.data.id_valor) {
                    if (data2[this_exam_date][i].min !== null  && typeof(data2[this_exam_date][i].min) != 'undefined') {
                      print_text_line1 =  "Método: " + d.data.metodo + "."
                      print_text_line2 = "Ref: " + data2[this_exam_date][i].min + " a " + data2[this_exam_date][i].max + ".";
                    } else {
                      print_text_line1 =  "Método: " + d.data.metodo + "."
                      print_text_line2 = "Ref: Sem referência.";
                    }
                  }
                }
              }
              var coordinates = [0, 0];
              coordinates = d3.mouse(this);
              var x_coord = coordinates[0];
              var y_coord = coordinates[1];
                // D3 v4
              var x_coord = d3.event.pageX - document.getElementById('history').getBoundingClientRect().x + 10
              var y_coord = d3.event.pageY - document.getElementById('history').getBoundingClientRect().y + 10
                var nodeSelection = d3.select('#history-svg')
              .insert('g')
                .attr('id', 'hist_current_tooltip')
                // .attr("transform", "translate(" + (d3.mouse(this)[0] + 5) + " , " + (d3.mouse(this)[1] + 20) + ")") //previous
                .attr("transform", "translate(" + (x_coord - $(window).scrollLeft()) + " , " + (y_coord - $(window).scrollTop()) + ")")
                .attr('class', 'newtooltip')
                .attr("filter", "url(#hist-mid-sepia)")
                ;

                var this_font_size = 15;
                var this_text = nodeSelection
                .append('text')
                .attr('x', "0")
                .attr('y', "0")
                .attr('font-size', this_font_size)
                ;

                var tspan1 = this_text.append('tspan')
                .attr('x', "0")
                .attr("dy", this_font_size)
                .attr("dx", "0")
                .text(print_text_line1)
                ;
                if (print_text_line2) {
                  var tspan2 = this_text.append('tspan')
                  .attr('x', "0")
                  .attr("dy", this_font_size)
                  .attr("dx", "0")
                  .text(print_text_line2)
                  ;
                }
                hist_mkBox(nodeSelection ,this_text);
            }
        };

  hist_unhover = function(d) {
          d3.select("#hist_current_tooltip").remove(); //removes element
        };

  hist_setWindowClickListener = function(e) {
          if (e.target !== focusedElement) {
            hist_clicked_bool = false;
            hist_last_clicked.attr('filter', null);
            hist_last_clicked = null;
            focusedElement = null;
            d3.select("#hist_highlight_rect").remove();
            div_tool.classed("focus-out-tooltip-div", true)
            .classed("focus-in-tooltip-div", false)
            ;
            window.removeEventListener('click', hist_setWindowClickListener);
          }
        }

  hist_mkBox2 = function(g, text) {
          var dim = text.node().getBBox();
            g.insert("rect", "text")
            .attr("id", "hist_highlight_rect")
            // .attr("class", "newtooltip_rect")
            .attr("x", dim.x)
            .attr("y", dim.y)
            .style('fill', 'yellow')
            // .attr("filter", "url(#mid-sepia)")
            .attr("width", dim.width)
            .attr("height", dim.height);
        }

  hist_click = function (d) {
            d3.select("#hist_highlight_rect").remove();
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else {
                if (hist_clicked_bool === false) {
                d.children = d._children;
                d._children = null;
                //tooltip for whole hist
                if (data_image_links[d.data.id_valor - 1]) {
                  document.getElementById('loadingDiv').classList.remove('d-none');
                  var img_link = data_image_links[d.data.id_valor - 1].ref_png;
                  div_tool.classed("focus-out-tooltip-div", false)
                    .classed("focus-in-tooltip-div", true)
                    ;
                  // d3.select(this).attr("filter", "url(#highlight-bright)");
                  hist_last_clicked = d3.select(this);
                  var hist_last_clicked_text = d3.select(hist_last_clicked["_groups"][0][0].children[1])
                  // console.log(tree_last_clicked);
                  // console.log(d3.select(tree_last_clicked["_groups"][0][0].children[1]));
                  hist_mkBox2(hist_last_clicked, hist_last_clicked_text);
                  // console.log(l)
                  var parent_x_pos = this.getBoundingClientRect().left + (this.getBoundingClientRect().width / 1.5);
                  parent_x_pos = parent_x_pos +  $(window).scrollLeft();
                  var parent_y_pos = this.getBoundingClientRect().top +  this.getBoundingClientRect().height;
                  parent_y_pos = parent_y_pos +  $(window).scrollTop();
                  div_tool.html("<img class='image-tool' onload='showLoadingDiv()' src='" + img_link + "' alt=''>")
                    .style("left", (parent_x_pos) + "px")
                    .style("top", (parent_y_pos) + "px");
                  last_focus = true;
                  focusedElement = d3.event.target;
                  window.addEventListener('click', hist_setWindowClickListener);
                  hist_clicked_bool = true;
                }
              } else {
                hist_last_clicked.attr('filter', null);
                hist_last_clicked = null;
                focusedElement = null;
                d3.select("#tree_highlight_rect").remove();
                div_tool.classed("focus-out-tooltip-div", true)
                .classed("focus-in-tooltip-div", false)
                ;
                window.removeEventListener('click', hist_setWindowClickListener);
                hist_clicked_bool = false;
              }
            }
            hist_update(d);
        };

  hist_update = function (source) {
            // console.log("hist_update");
            hist_width = 800;
            // Compute the new tree layout.
            var hist_nodes = hist_tree(hist_root);
            // console.log(hist_nodes);
            var hist_nodesSort = [];
            hist_nodes.eachBefore(function (n) {
                hist_nodesSort.push(n);
            });
            var hist_def = 15;
            // console.log(viewport().width);
            if (viewport().width > 1700) {
              hist_def = 20;
            }
            if (viewport().width > 1900) {
              hist_def = 26;
            }
            var hist_barHeight = hist_def;
            hist_height = Math.max(500, hist_nodesSort.length * hist_barHeight + hist_margin.top + hist_margin.bottom) + 500;
            var hist_links = hist_nodesSort.slice(1);
            // Compute the "layout".
            hist_nodesSort.forEach(function (n, i) {
                n.x = i * hist_barHeight;
            });
            // d3.select('svg').transition()
            d3.select('#history-svg').transition()
                .duration(hist_duration)
                .attr("height", hist_height);
            // Update the nodes…
            var hist_node = hist_svg.selectAll('g.node')
                .data(hist_nodesSort, function (d) {
                return d.id || (d.id = ++hist_i);
            });
            // Enter any new nodes at the parent's previous position.
            var hist_nodeEnter = hist_node.enter().append('g')
                .attr('class', 'node')
                .attr('transform', function () {
                return 'translate(' + source.y0 + ',' + source.x0 + ')';
            })
                .on('click', hist_click)
                // .on('click', function(d) {click(this);})
                // clicked_bool = false
                .on('mouseover', hist_hover)
                .on('mouseout', hist_unhover)
                ;

            hist_nodeEnter.append('circle')
                .attr('r', 1e-6)
                .attr("class", function(d) {
                  if (d.data.id_valor) { //se no folha
                    var final_class = childColor(d.data);// + " tooltip";
                    return final_class;
                  } else { //se no pai, checar validez dos nos filhos.
                    var new_color = "fill";
                    return new_color;
                  }
                })
                .style("cursor", "pointer")
                .on('click', function(d){
                  if (!d.children && data_image_links[d.data.id_valor - 1]) {
                    document.getElementById('loadingDiv').classList.remove('d-none');
                    var img_link = data_image_links[d.data.id_valor - 1].ref_png;
                    div_tool.classed("focus-out-tooltip-div", false)
                      .classed("focus-in-tooltip-div", true)
                      ;
                    var parent_x_pos = this.parentNode.getBoundingClientRect().left + (this.parentNode.getBoundingClientRect().width / 1.5);
                    parent_x_pos = parent_x_pos +  $(window).scrollLeft();
                    var parent_y_pos = this.parentNode.getBoundingClientRect().top +  this.parentNode.getBoundingClientRect().height;
                    parent_y_pos = parent_y_pos +  $(window).scrollTop();
                    div_tool.html("<img class='image-tool' onload='showLoadingDiv()' src='" + img_link + "' alt=''>")
                      .style("left", (parent_x_pos) + "px")
                      .style("top", (parent_y_pos) + "px");
                    last_focus = true;
                  }
                })
                .on('focusout', function(d) {
                  if (!d.children) {
                    div_tool.classed("focus-out-tooltip-div", true)
                    .classed("focus-in-tooltip-div", false)
                    ;
                  }
                })
                ;
            var hist_nodeTextEnter = hist_nodeEnter.append('text')
                .attr("class", "nodetext1")
                .attr('x', function (d) {
                return d.children || d._children ? 10 : 10;
                })
                .attr('dy', '.35em')
                .attr('text-anchor', function (d) {
                return d.children || d._children ? 'start' : 'start';
                })
                .style('fill-opacity', 1e-6)
                ;

            hist_nodeTextEnter.append("tspan")
            // nodeEnter.append("text")
                .attr("class", "nodetext2")
                // .attr("class", "nodetspan0")
                .style("fill", "black")
                .text(function (d) {
                  if (d.data.children) {
                    // return d.data.name.split("_")[d.data.name.split("_").length - 1] + " (";
                    return d.data.name_to_print + " (";
                  } else {
                    return d.data.name_to_print;
                  }
                })
                .style('fill-opacity', 1e-6)//;
                ;
            hist_nodeTextEnter.append("tspan")
            // nodeEnter.append("text")
                // .attr("class", "nodetspan1")
                .attr("class", "nodetext3")
                .style("fill", function(d) {
                  if (d.data.children) {
                    var number_invalids = hist_parent_object_invalid_counts[d.data.name];
                    if (number_invalids > 0) {
                      return "red";
                    }
                  }
                  return "black";
                })
                .text(function (d) {
                  if (d.data.children) {
                    var number_invalids = hist_parent_object_invalid_counts[d.data.name];
                    if (number_invalids === 0) {
                      return "";
                    }
                    return number_invalids;
                  }
                  return "";
                })
                .style('fill-opacity', 1e-6)//;
                ;
            hist_nodeTextEnter.append("tspan")
            // nodeEnter.append("text")
                // .attr("class", "nodetspan2")
                .attr("class", "nodetext4")
                .style("fill", "black")
                .text(function (d) {
                  if (d.data.children) {
                    var number_invalids = hist_parent_object_invalid_counts[d.data.name];
                    var number_leaves = hist_parent_object_counts[d.data.name];
                    if (number_invalids === 0) {
                      return number_leaves + ")";
                    }
                    return "/" + number_leaves + ")";
                  }
                  return "";
                })
                .style('fill-opacity', 1e-6)//;
                ;

            // Transition nodes to their new position.
            var hist_nodeUpdate = hist_node.merge(hist_nodeEnter)
                .transition()
                .duration(hist_duration);
            hist_nodeUpdate
                .attr('transform', function (d) {
                return 'translate(' + d.y + ',' + d.x + ')';
            });
            hist_nodeUpdate.select('circle')
                .attr('r', 4.5)
                .attr("class", function(d) {
                  if (d.data.id_valor) { //se no folha
                    // console.log(d);
                    // console.log("d.data");
                    // console.log(d.data);
                    var final_class = childColor(d.data); // + " tooltip";
                    // console.log(d.data.name);
                    // console.log(final_class);
                    return final_class;
                  } else { //se no pai, checar validez dos nos filhos.
                    var new_color = "fill";
                    return new_color;
                  }
                });

            hist_nodeUpdate.select('text.nodetext1')
                    .style('fill-opacity', 1);
            hist_nodeUpdate.select('tspan.nodetext2')
                    .text(function (d) {
                      if (d.data.children) {
                        // return d.data.name.split("_")[d.data.name.split("_").length - 1] + " (";
                        return d.data.name_to_print + " (";
                      } else {
                        return d.data.name_to_print;
                      }
                    })
                    .style('fill-opacity', 1);
            hist_nodeUpdate.select('tspan.nodetext3')
                    .text(function (d) {
                      if (d.data.children) {
                        var number_invalids = hist_parent_object_invalid_counts[d.data.name];
                        if (number_invalids === 0) {
                          return "";
                        }
                        return number_invalids;
                      }
                      return "";
                    })
                    .style('fill-opacity', 1);
            hist_nodeUpdate.select('tspan.nodetext4')
                    .text(function (d) {
                      if (d.data.children) {
                        var number_invalids = hist_parent_object_invalid_counts[d.data.name];
                        var number_leaves = hist_parent_object_counts[d.data.name];
                        if (number_invalids === 0) {
                          return number_leaves + ")";
                        }
                        return "/" + number_leaves + ")";
                      }
                      return "";
                    })
                    .style('fill-opacity', 1);
            // Transition exiting nodes to the parent's new position (and remove the nodes)
            var hist_nodeExit = hist_node.exit().transition()
                .duration(0);
                // .duration(tree_duration);
            hist_nodeExit
                .attr('transform', function (d) {
                // console.log(d.data.name_to_print);
                return 'translate(' + source.y + ',' + source.x + ')';
            })
                .remove();
            hist_nodeExit.select('circle')
                .attr('r', 1e-6);
            hist_nodeExit.select('text')
                .style('fill-opacity', 1e-6);
            // Update the links…
            var hist_link = hist_svg.selectAll('path.link')
                .data(hist_links, function (d) {
                var id = d.id + '->' + d.parent.id;
                return id;
            });
            // Enter any new links at the parent's previous position.
            var hist_linkEnter = hist_link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', function (d) {
                var o = { x: source.x0, y: source.y0, parent: { x: source.x0, y: source.y0 } };
                return hist_connector(o);
            });
            // Transition links to their new position.
            hist_link.merge(hist_linkEnter).transition()
                .duration(hist_duration)
                .attr('d', hist_connector);
            // // Transition exiting nodes to the parent's new position.
            hist_link.exit().transition()
                .duration(hist_duration)
                .attr('d', function (d) {
                var o = { x: source.x, y: source.y, parent: { x: source.x, y: source.y } };
                return hist_connector(o);
            })
                .remove();
            // Stash the old positions for transition.
            hist_nodesSort.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        };

  hist_margin = { top: 20, right: 10, bottom: 20, left: 10 };
  hist_do_width = $('#history-tree').width() > 0 ? $('#history-tree').width() : $('#history-tree').width();
  hist_do_height = $('body').height();
  hist_width = 1000 - hist_margin.right - hist_margin.left;
  hist_height = 2800 - hist_margin.top - hist_margin.bottom;

  hist_barWidth = hist_width * .8;
  hist_i = 0;
  hist_duration = 750;
  hist_tree = d3.tree().size([hist_width, hist_height]);
  hist_tree = d3.tree().nodeSize([0, 30]);
  // var used_data = initialDataAdjust(data);
  hist_used_data = hist_data;
  hist_root = hist_tree(hierarchy(hist_used_data));
  // var root = tree(hierarchy(original_Data));
  hist_root.each(function (d) {
      d.name_to_print = d.id; //transferring name to a name variable
      d.id = hist_i; //Assigning numerical Ids
      hist_i++;
  });
  hist_root.x0 = hist_root.x;
  hist_root.y0 = hist_root.y;
  var myNode = document.getElementById('history-svg');
  if (myNode) {
    myNode.parentNode.removeChild(myNode);
  }
  hist_svg = d3.select('#history-tree').append('svg')
      .attr("id", "history-svg")
      .attr('width', hist_width + hist_margin.right + hist_margin.left)
      .attr('height', hist_height + hist_margin.top + hist_margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + hist_margin.left + ',' + hist_margin.top + ')');

  //create sepia filter
  // var defs = svg.append('defs');
  //https://stackoverflow.com/questions/41986812/svg-sepia-filter-effect-mid-tones-only
  var hist_sepia_filter = d3.select('#history-svg').insert('filter')
  .attr('id','hist-mid-sepia')
  .attr('color-interpolation-filters', 'sRGB')
  ;
  hist_sepia_filter.append("feColorMatrix")
  .attr("type", "matrix")
  .attr("result", "hist-sepia-clip")
  .attr("values", "0.39 0.769 0.189 0 0  0.349 0.686 0.168 0 0  0.272 0.534 0.131 0 0  0 0 0 1 0")
  ;
  hist_sepia_filter.append("feComposite")
  .attr("operator", "over")
  .attr("in", "hist-sepia-clip")
  ;

  var hist_highlight_filter = d3.select('#history-svg').insert('filter')
  .attr('id', 'hist-highlight-bright')
  .attr('color-interpolation-filters', 'sRGB')
  ;
  hist_highlight_filter.append("feColorMatrix")
  .attr('type', 'matrix')
  .attr("result", "hist_highlight_this")
  .attr("values", "1.2 0.2 0.2 0 0  0.2 1.2 0.2 0 0  0.2 0.2 1.2 0 0  0 0 0 1 0")
  ;
  hist_highlight_filter.append("feComposite")
  .attr("operator", "over")
  .attr("in", "hist_highlight_this")
  ;

  hist_root.children.forEach(hist_collapseLevel);
  hist_update(hist_root);
}

let vertical_eagle_lines;
let horizontal_eagle_lines;
let vertical_middle_line;
let left_hanging_labels;
let result_eagle_dots;
let original_EagleData;
let current_EagleData;
let ramp_x;
let ramp_y;

let min_x_avg;
let max_x;
let min_x;
let ext_x;
let old_eagle_data;
const tt_div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("z-index", 999);

const svg_w = 1000,
      svg_h = 600;

let svg2 = d3
      .select("#eagle-view")
      .append("svg")
      .attr("width", svg_w)
      .attr("height", svg_h)
      .style("border-style", "solid")
      ;

let ramp_x_custom;
function draw_svg_eagle(exam, f_time) {
  ext_x = d3.extent(exam, d => d.val_norm);
  min_x = Math.round(ext_x[0]) - 0.5; // negative
  max_x = Math.round(ext_x[1]) + 0.5;
  min_x_avg = min_x + 0.5;
  var  svg_pad = 10;

  ramp_x_custom = d3
    .scaleLinear()
    .domain([min_x, max_x])
    .range([-20, svg_w + 10]);

  if (f_time === true) {
    ramp_y = d3
      .scaleLinear()
      .domain([0, eagle_data.length - 1])
      .range([10, svg_h - 10]);
  }
  custom_exam_plus = Array.apply(null, Array(exam.length + 2)).map(function () {});

  var ramp_x_min = -5 < min_x ? -5 : min_x;
  var ramp_x_max = 5 > max_x ? 5 : max_x;
  ramp_x = d3
    .scaleLinear()
    // .domain([min_x, max_x])
    .domain([ramp_x_min, ramp_x_max])
    .range([svg_pad, svg_w - svg_pad]);

  // ramp_y = d3
  //   .scaleLinear()
  //   .domain([0, eagle_data.length - 1])
  //   .range([svg_pad, svg_h - svg_pad]);

  // clear canvas
  svg2.selectAll("*").remove();

  // draw green zone
  svg2
    .append("rect")
    .attr("id", "greenzone")
    .attr("fill", "#d0ffd0")
    .attr("x", ramp_x(-1))
    .attr("y", ramp_y(0))
    .attr("width", ramp_x(1) - ramp_x(-1))
    .attr("height", ramp_y(exam.length - 1) - ramp_y(0));

  // grid horiz
  vertical_eagle_lines = svg2
    .selectAll("line-horiz")
    .data(exam)
    .enter()
    .append("line")
    .attr("class", "horiz")
    .style("stroke", "lightgray")
    .style("stroke-width", "1px")
    // .attr("x1", d => ramp_x(min_x_avg))
    .attr("x1", d => ramp_x(min_x_avg - 1))
    .attr("y1", (d, i) => ramp_y(i))
    // .attr("x2", d => ramp_x(max_x))
    .attr("x2", d => ramp_x(max_x + 1))
    .attr("y2", (d, i) => ramp_y(i));

  // grid vert
  horizontal_eagle_lines = svg2
    .selectAll("line-vert")
    // .data(d3.range(min_x_avg, max_x + 0.01, 0.5).filter(d => d !== 0))
    .data(d3.range(min_x_avg - 1, max_x + 1.01, 0.5).filter(d => d !== 0))
    .enter()
    .append("line")
    // .classed("line-horiz", true)
    .attr("class", "horiz")
    .style("stroke", "lightgray")
    .style("stroke-width", "1px")
    .attr("x1", d => ramp_x(d))
    .attr("y1", d => ramp_y(0))
    .attr("x2", d => ramp_x(d))
    .attr("y2", d => ramp_y(exam.length - 1));

  // vertical middle line
  vertical_middle_line = svg2
    .append("line")
    .style("stroke-dasharray", "3,3")
    .style("stroke-width", "1px")
    .style("stroke", "gray")
    .attr("x1", d => ramp_x(0))
    .attr("y1", d => ramp_y(0))
    .attr("x2", d => ramp_x(0))
    .attr("y2", d => ramp_y(exam.length - 1));

  // left-hanging vert axis labels (exam names)
  // left_hanging_labels.remove();
  left_hanging_labels = svg2
    .selectAll("axis-text")
    .data(exam)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 10)
    // .attr("x", d => ramp_x(min_x_avg)-3)
    .attr("x", d => ramp_x(min_x_avg - 1.1))
    .attr("y", (d, i) => ramp_y(i))
    .style("fill", d => d.text_color)
    .text(d => d.exam_name);

  // result dots (green and red)
  result_eagle_dots = svg2
    .selectAll("dots")
    .data(exam)
    .enter()
    .append("circle")
    //.classed("dots", true)
    .style("fill", d => d.dot_color)
    .attr("r", 3.25)
    .attr("cx", d => ramp_x(d.val_norm))
    // .attr("cy", (d, i) => ramp_y(i))
    .attr("cy", (d, i) => ramp_y(d.order_y))
    //.on("mouseover", tt_show(d))
    .on("mouseover", function(d) {
      tt_div
        .transition()
        .duration(500)
        .style("opacity", 0.8);
      tt_div
        .text(d.tooltip)
        .style("color", d.text_color)
        .style("left", d3.event.pageX - 48 + "px")
        .style("top", d3.event.pageY - 20 + "px");
    })
    .on("mouseout", function(d) {
      tt_div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
}

function draw_exams() {
  var main_section = document.getElementById("main_section");

  var imagescarrousel = document.createElement("div");
  imagescarrousel.id = "imagescarrousel";
  imagescarrousel.classList.add("d-none");
  for (var i = 1; i <= 8; i++) {
    var image_path = "img/0" + i + " exame img.png"
    var image_alt = "Exame 0" + i;
    var image_object_div = document.createElement("div");
    image_object_div.classList.add("d-none");
    image_object_div.classList.add("mySlides");
    var image_object = document.createElement("img");
    image_object.classList.add("d-block");
    image_object.classList.add("img-wrapper2");
    image_object.src = image_path;
    image_object.alt = image_alt;
    image_object_div.appendChild(image_object);
    imagescarrousel.appendChild(image_object_div);
  }
  main_section.appendChild(imagescarrousel);
};
//data ajax functions
function doInitialAjax(currentSex, birthData, examData, new_data_rules) {
  // document.getElementById('loadingDiv').classList.remove('d-none');
  var data_to_go;
  $.ajax({
    url: "https://dan-reznik.ocpu.io/AzorPkg/R/validate_exams_df/json",
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({"sex": currentSex, "birth_ymd": birthData, "exam_ymd": examData, "df_id_value": new_data_rules}),
    success: function (data_go) {
      for (var i = 0; i < data_go.length; i++) {
        data2[examData][i] = data_go[i];
      }
      requestCallback.requestComplete(true);
    },
    error: function(){
      alert("Cannot get initial data2");
    }
  });
  // document.getElementById('loadingDiv').classList.add('d-none');
}

function doThisAjax(currentSex, birthData, examData, new_data_rules) {
  // document.getElementById('loadingDiv').classList.remove('d-none');
  $.ajax({
    url: "https://dan-reznik.ocpu.io/AzorPkg/R/validate_exams_df/json",
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({"sex": currentSex, "birth_ymd": birthData, "exam_ymd": examData, "df_id_value": new_data_rules}),
    success: function (data_go) {
      for (var i = 0; i < data_go.length; i++) {
        data2[examData][i] = data_go[i];
      }
      requestThisCallback.requestComplete(true);
    },
    error: function(){
      alert("Cannot get initial data2");
    }
  });
  // document.getElementById('loadingDiv').classList.add('d-none');
}

function doAjax(currentSex, birthData, examData, new_data_rules, typerender) {
  document.getElementById('loadingDiv').classList.remove('d-none');
  // data2_id_name = "id";
  tree_clicked_bool = false;
  $.ajax({
    url: "https://dan-reznik.ocpu.io/AzorPkg/R/validate_exams_df/json",
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({"sex": currentSex, "birth_ymd": birthData, "exam_ymd": examData, "df_id_value": new_data_rules}),
    success: function (data_go) {
      for (var var_obj4 in data_go) {
        var use_max = data_go[var_obj4].max;
        var use_min = data_go[var_obj4].min;
        var use_valid = data_go[var_obj4].valid;
        // var use_method = data_go[var_obj4].descr_metodo;
        // var use_method_id = data_go[var_obj4].id_metodo;
        var use_method_id = data_go[var_obj4].id;
        if (use_max) {
          data2[examData][var_obj4].max = use_max;
          data2[examData][var_obj4].min = use_min;
          data2[examData][var_obj4].valid = use_valid;
          // data2[var_obj4].metodo = use_method;
          data2[examData][var_obj4].id_metodo = use_method_id;
        } else {
          data2[examData][var_obj4].max = null;
          data2[examData][var_obj4].min = null;
          data2[examData][var_obj4].valid = null;
          data2[examData][var_obj4].id_metodo = use_method_id;
        }
      }
      parent_object_counts = {};
      parent_object_invalid_counts = {};
      parentValidationObject(original_Data);
      current_Data = JSON.parse(JSON.stringify(original_Data));
      //if filtering has been activated
      if (filtering_active === true) {
        filterTree_expand(original_Data, lookup);
      } else {
        tree_update(tree_root);
      }
      // parentValidationObject(current_Data);
    },
    error: function(){
      alert("Cannot get data");
    }
  });
  document.getElementById('loadingDiv').classList.add('d-none');
}

function doImageAjax(currentSex, birthData, examData, exam_ids, exam_values, rerenderfalse) {
  // document.getElementById('loadingDiv').classList.remove('d-none');
  $.ajax({
      url: "https://dan-reznik.ocpu.io/AzorPkg2/R/validate_exams/json?auto_unbox=true",
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({"sex": currentSex, "birth_ymd": birthData, "exam_ymd": examData, "ref_png":true, "exam_id_vec": exam_ids, "exam_value_vec": exam_values}),
      success: function (result_data) {
        for (var i = 0; i < result_data.length; i++) {
          data_image_links[examData][result_data[i].id_valor] = result_data[i];
        }
        // data_image_links[examData] = result_data;
        requestCallbackImageAjax.requestComplete(true);
        // return result_data;

        // data_image_links = result_data;
      },
      error: function(){
        alert("Cannot get Image Ajax data");
        // return null;
      }
  });
  // document.getElementById('loadingDiv').classList.add('d-none');
}

function runImageAjax() {
  requestCallbackImageAjax = new MyRequestsCompleted({
      numRequest: examDatas.length,
      singleCallback: function(){
        console.log("data_image_links");
        console.log(data_image_links);
        //needs to update eagle_data here w/ update
        hist_update(hist_root);
        tree_update(tree_root);
        updateEagleAjax();
      }
  });
  parseData2Object();
};

let parseData2Object = function() {
  //parses data2 object and updates imageajax
  for (var i = 0; i < examDatas.length; i++) {
    var examData = examDatas[i];
    // data_image_links[examData] = {};
    data_image_links[examData] = {};
    for (var var_obj3 in data2[examData]) {
      if (data2[examData][var_obj3]["value"] === null) {
        exam_ids.push(data2[examData][var_obj3]["id"]);
        exam_values.push([null]);
      } else {
        exam_ids.push(data2[examData][var_obj3]["id"]);
        exam_values.push(data2[examData][var_obj3]["value"]);
      }
    }
    console.log("running image ajax");
    console.log("examData");
    console.log(examData);
    doImageAjax(currentSexa, birthDataa, examData, exam_ids, exam_values);
  }
}

var updateData2Object = function(){
  for (var i = 0; i < examDatas.length; i++) {
    var examData = examDatas[i];
    var new_data_rules = arrayToAjax(examData);
    data2[examData] = [];
    console.log("running initial ajax");
    console.log("examData");
    console.log(examData);
    doThisAjax(currentSexa, birthDataa, examData, new_data_rules);
  }
};

function parentValidationObject(input_Data) {
  var data2_id_valid = {};

  for (var z = 0; z < examDatas.length; z++) {
    var current_date = examDatas[z];
    data2_id_valid[current_date] = {};
  }
  function untangleData2() {
      for (var j = 0; j < examDatas.length; j++) {
        var examDate = examDatas[j];
        for (var i = 0; i < data2[examDate].length; i++) {
          // console.log(data2[i]);
          data2_id_valid[examDate][data2[examDate][i]["id"]] = data2[examDate][i].valid;
        }
      }
  }
  untangleData2();

  var full_nodes_map = {};
  function untangleNodes (node) {
    full_nodes_map[node.name] = node;
    //recursive on all the children
    node.children && node.children.forEach(untangleNodes);
  }
  untangleNodes(input_Data);

  //recursive function to count total leaves in a parent object
  function totalLeafCount(this_object, parent_object_name) {
    if (this_object.children) {
      this_object.children.forEach(function (c) {
        if (c.children) {
          totalLeafCount(c, parent_object_name);
        } else {
          if (c.id_valor) {
            parent_object_counts[parent_object_name] += 1;
          }
        }
      })
    } else {
      if (this_object.id_valor) {
        parent_object_counts[parent_object_name] += 1;
      }
    }
  };

  //recursive function to count total invalid leaves in a parent object
  function totalInvalidLeafCount(this_object, parent_object_name) {
    if (this_object.children) {
      this_object.children.forEach(function (g) {
        if (g.children) {
          totalInvalidLeafCount(g, parent_object_name);
        } else {
          if (g.id_valor) {
            var current_examDate = objects_exam_dates[g.name];
            if ( (data2_id_valid[current_examDate][g.id_valor] === false) ) {
              parent_object_invalid_counts[parent_object_name] += 1;
            }
          }
        }
      })
    } else {
      if (this_object.id_valor) {
        var current_examDate = objects_exam_dates[this_object.name];
        if ( (data2_id_valid[current_examDate][this_object.id_valor] === false)) {
          parent_object_invalid_counts[parent_object_name] += 1;
        }
      }
    }
  };

  for (var naming in full_nodes_map) {
    if (full_nodes_map.hasOwnProperty(naming)) {
      var current_object = full_nodes_map[naming];
      if (current_object.children) {
        parent_object_counts[current_object.name] = 0;
        parent_object_invalid_counts[current_object.name] = 0;
        totalLeafCount(current_object, current_object.name);
        totalInvalidLeafCount(current_object, current_object.name);
      } else {
        if (current_object.name_to_print.indexOf(' \(0\)') > -1) {
          parent_object_counts[current_object.name] = 0;
          parent_object_invalid_counts[current_object.name] = 0;
        }
      }
    }
  }
}

function parentValidationObjectHist(input_Data) {
  var data2_id_valid = {};
  for (var z = 0; z < examDatas.length; z++) {
    var current_date = examDatas[z];
    data2_id_valid[current_date] = {};
  }
  function untangleData2() {
      for (var j = 0; j < examDatas.length; j++) {
        var examDate = examDatas[j];
        for (var i = 0; i < data2[examDate].length; i++) {
          // console.log(data2[i]);
          data2_id_valid[examDate][data2[examDate][i]["id"]] = data2[examDate][i].valid;
        }
      }
  }
  untangleData2();

  var full_nodes_map = {};
  function untangleNodes (node) {
    full_nodes_map[node.name] = node;
    //recursive on all the children
    node.children && node.children.forEach(untangleNodes);
  }
  untangleNodes(input_Data);

  //recursive function to count total leaves in a parent object
  function totalLeafCount(this_object, parent_object_name) {
    if (this_object.children) {
      this_object.children.forEach(function (c) {
        if (c.children) {
          totalLeafCount(c, parent_object_name);
        } else {
          if (c.id_valor) {
            hist_parent_object_counts[parent_object_name] += 1;
          }
        }
      })
    } else {
      if (this_object.id_valor) {
        hist_parent_object_counts[parent_object_name] += 1;
      }
    }
  };

  //recursive function to count total invalid leaves in a parent object
  function totalInvalidLeafCount(this_object, parent_object_name) {
    if (this_object.children) {
      this_object.children.forEach(function (g) {
        if (g.children) {
          totalInvalidLeafCount(g, parent_object_name);
        } else {
          if (g.id_valor) {
            var current_examDate = objects_exam_dates_hist[g.name];
            if ( (data2_id_valid[current_examDate][g.id_valor] === false) ) {
              hist_parent_object_invalid_counts[parent_object_name] += 1;
            }
          }
        }
      })
    } else {
      if (this_object.id_valor) {
        var current_examDate = objects_exam_dates_hist[this_object.name];
        if ( (data2_id_valid[current_examDate][this_object.id_valor] === false)) {
          hist_parent_object_invalid_counts[parent_object_name] += 1;
        }
      }
    }
  };

  for (var naming in full_nodes_map) {
    if (full_nodes_map.hasOwnProperty(naming)) {
      var current_object = full_nodes_map[naming];
      if (current_object.children) {
        hist_parent_object_counts[current_object.name] = 0;
        hist_parent_object_invalid_counts[current_object.name] = 0;
        totalLeafCount(current_object, current_object.name);
        totalInvalidLeafCount(current_object, current_object.name);
      } else {
        if (current_object.name_to_print.indexOf(' \(0\)') > -1) {
          hist_parent_object_counts[current_object.name] = 0;
          hist_parent_object_invalid_counts[current_object.name] = 0;
        }
      }
    }
  }
}

let requestCallback;
let requestCallbackImageAjax;

function mapNameToDate() {
  //get current exam ids and values
  //uncollapse data object
  var full_nodes_map2 = {};
  function untangleNodes_b (node) {
    full_nodes_map2[node.name] = node;
    //recursive on all the children
    node.children && node.children.forEach(untangleNodes_b);
  }
  untangleNodes_b(data);

  function findChildrenGetName(obj, currentDate) {
    if (obj.children)  {
      objects_exam_dates[obj.name] = currentDate;
      obj.children.forEach(function(d) {
        if (d.children) {
          objects_exam_dates[d.name] = currentDate;
          findChildrenGetName(d, currentDate);
        } else {
          objects_exam_dates[d.name] = currentDate;
        }
      });
    } else {
      objects_exam_dates[obj.name] = currentDate;
    }
  }

  for (var e_obj in full_nodes_map2) {
    if (full_nodes_map2.hasOwnProperty(e_obj)) {
      if (full_nodes_map2[e_obj]["name"].indexOf("Exam_Date") > -1) {
        var new_date = full_nodes_map2[e_obj]["name"].split("_")[0];
        findChildrenGetName(full_nodes_map2[e_obj], new_date);
      }
    }
  }
  console.log("objects_exam_dates");
  console.log(objects_exam_dates);
}

function mapNameToDateHist() {
  var full_nodes_map2 = {};
  function untangleNodes_b (node) {
    full_nodes_map2[node.name] = node;
    //recursive on all the children
    node.children && node.children.forEach(untangleNodes_b);
  }
  untangleNodes_b(hist_data);
  console.log("full_nodes_map2");
  console.log(full_nodes_map2);
  for (var e_obj in full_nodes_map2) {
    if (full_nodes_map2.hasOwnProperty(e_obj)) {
      if (!full_nodes_map2[e_obj].children) {
        var new_date = full_nodes_map2[e_obj]["name"].split("_")[0];
        objects_exam_dates_hist[full_nodes_map2[e_obj]["name"]] = new_date;
      }
    }
  }
  console.log("objects_exam_dates_hist");
  console.log(objects_exam_dates_hist);
}

function defineData2() {
  //should loop over datas, fetch every time a new data2 and save in the data2 object
  fetch("https://dan-reznik.ocpu.io/AzorPkg2/json/tree_ale_history_grouped.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    hist_data = json;
    console.log("data_history");
    console.log(hist_data);
    oldHistData = JSON.parse(JSON.stringify(data));
    original_HistData = JSON.parse(JSON.stringify(hist_data));
    current_HistData = JSON.parse(JSON.stringify(original_HistData));
    mapNameToDateHist();
    for (var i = 0; i < examDatas.length; i++) {
      var examData = examDatas[i];
      data2[examData] = [];
      var new_data_rules = arrayToAjax(examData);
      doInitialAjax(currentSexa, birthDataa, examData, new_data_rules);
      // data2[examData] = return_data;
    }
  });
}

function defineData() {
  fetch("https://dan-reznik.ocpu.io/AzorPkg2/json/tree_ale_history.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    data = json;
    console.log("data");
    console.log(data);
    oldData = JSON.parse(JSON.stringify(data));
    original_Data = JSON.parse(JSON.stringify(data));
    current_Data = JSON.parse(JSON.stringify(original_Data));
    mapNameToDate();
    //data list should be defined here
    var full_nodes_map_a = {};
    function untangleNodes_a (node) {
      full_nodes_map_a[node.name] = node;
      //recursive on all the children
      node.children && node.children.forEach(untangleNodes_a);
    }
    untangleNodes_a(data);
    for (var each_obj in full_nodes_map_a) {
      if (full_nodes_map_a.hasOwnProperty(each_obj)) {
        if (full_nodes_map_a[each_obj]["name"].indexOf("Exam_Date") > -1) {
          var new_date = full_nodes_map_a[each_obj]["name"].split("_")[0];
          examDatas.push(new_date);
          data2[new_date] = [];
        }
      }
    }
    //define callback for generating data2 after all ajax are completed
    requestCallback = new MyRequestsCompleted({
        numRequest: examDatas.length,
        singleCallback: function(){
          fetch("https://dan-reznik.ocpu.io/AzorPkg2/json/exame_ale_20180104_validated.json")
          .then(function(response) {
            return response.json();
          })
          .then(function(json) {
            eagle_data = prepareData(json);
            console.log(eagle_data);
            console.log("data2");
            console.log(data2);
            old_eagle_data = JSON.parse(JSON.stringify(eagle_data));
            original_EagleData = JSON.parse(JSON.stringify(eagle_data));
            current_EagleData =  JSON.parse(JSON.stringify(original_EagleData));
            parentValidationObject(data); //counts valid data and leaf number. needs data2 loaded
            parentValidationObjectHist(hist_data);
            console.log("parent_object_invalid_counts");
            console.log(parent_object_invalid_counts);
            console.log("parent_object_counts");
            console.log(parent_object_counts);
            console.log("hist_parent_object_invalid_counts");
            console.log(hist_parent_object_invalid_counts);
            console.log("hist_parent_object_counts");
            console.log(hist_parent_object_counts);
            return fetch("http://dan-reznik.ocpu.io/AzorPkg2/json/estudos.json"); // make a 2nd request and return a promise
          })
          .then(function(response) {
            return response.json();
          }).then(function(json) {
            group_data = json;
            // After getting all data, render svgs
            beforeRender();
          });
        }
    });
    defineData2();
  });
}

function beforeRender() {
  parseData2Object();
  requestCallbackImageAjax = new MyRequestsCompleted({
      numRequest: examDatas.length,
      singleCallback: function(){
        console.log("data_image_links");
        console.log(data_image_links);
        initial_render(data, data2, eagle_data);
      }
  });
}

// defineData(); //defines data variable and then data2 variable

let base_png;
// let patient_data_urls = ["https://dan-reznik.ocpu.io/AzorPkg2/json/tree_ale_min.json", "https://dan-reznik.ocpu.io/AzorPkg2/json/tree_dan_min.json"];
// let patient_grouped_data_urls = ["https://dan-reznik.ocpu.io/AzorPkg2/json/tree_ale_grouped_min.json", "https://dan-reznik.ocpu.io/AzorPkg2/json/tree_dan_grouped_min.json"];
let patient_data_urls = [];
let patient_grouped_data_urls = [];
let patients_full_data;
const url_base = "https://dan-reznik.ocpu.io"
$('#patient_select').on('change', function() {
  // var name_to_do = $(this).find('option:selected').attr("name");
  var name_to_do = $(this).find('option:selected').data("name");
  console.log("name_to_do * 1");
  console.log(name_to_do * 1);
  console.log("About to run redefine datas");
  new_redefineDatas(name_to_do);
});

function new_defineDatas(index_patient) {
  fetch("https://dan-reznik.ocpu.io/AzorPkg2/json/pacientes.json",{method: 'get',
    url: 'https://cors-anywhere.herokuapp.com/'+"https://dan-reznik.ocpu.io/AzorPkg2/json/pacientes.json",
    headers: {'Origin': url_base}}
  )
  .then(function(response) {
    console.log("response");
    console.log(response);
    return response.json();
  })
  .then(function(json) {
    patients_full_data = json;
    console.log(patients_full_data);
    for (var i = 0; i < patients_full_data.length; i++) {
      var data_url = patients_full_data[i].json_prefix +  patients_full_data[i].json_tree_min;
      if (data_url === patients_full_data[i].json_prefix + "ree_dan_min.json") {
        data_url = patients_full_data[i].json_prefix + "tree_dan_min.json";
      }
      var data_url_group = patients_full_data[i].json_prefix +  patients_full_data[i].json_tree_grouped_min;
      patient_data_urls.push(data_url);
      patient_grouped_data_urls.push(data_url_group);
      var new_opt = document.createElement("option");
      new_opt.innerHTML = patients_full_data[i].name_patient;
      new_opt.setAttribute("data-name", i);
      // new_opt.name = i;
      document.getElementById("patient_select").appendChild(new_opt);
      console.log("new_opt");
      console.log(new_opt);
      // trigger changes on select
    }
    return fetch(patient_data_urls[index_patient],{method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/'+patient_data_urls[index_patient],
      headers: {'Origin': url_base}}
    )
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    data = json; //defined initial data
    // console.log(data);
    //define patient sex
    //define patient birth_ymd
    currentSexa = data.sex;
    d3.select("#patient_name_define").node().innerHTML = data.name;
    d3.select("#patient_phone").node().innerHTML = patients_full_data[index_patient].phone;
    currentSexa = data.sex;
    birthDataa = data.birth_ymd;
    birthYear = parseInt(birthDataa.substr(0, 4));
    birthMonth = parseInt(birthDataa.substr(4, 2)) -1;
    birthDay = parseInt(birthDataa.substr(6, 2));
    initBirth();
    var birth_moment = moment(birthDataa, "YYYYMMDD");
    var current_moment = moment();
    var age = current_moment.diff(birth_moment, 'years') + "";
    var sex_text = data.sex === "M" ? "Homem, " : "Mulher, ";
    d3.select("#sex_age").node().innerHTML = sex_text + age;
    console.log("age");
    console.log(age);
    base_png = data.png_ref_base;
    birthDataa = data.birth_ymd;
    base_png = data.png_ref_base;

    oldData = JSON.parse(JSON.stringify(data));
    original_Data = JSON.parse(JSON.stringify(data));
    current_Data = JSON.parse(JSON.stringify(original_Data));
    mapNameToDate();
    //data list should be defined here
    var full_nodes_map_a = {};
    function untangleNodes_a (node) {
      full_nodes_map_a[node.name] = node;
      //recursive on all the children
      node.children && node.children.forEach(untangleNodes_a);
    }
    untangleNodes_a(data);

    var new_date;
    var current_list = [];
    var current_list_image_links = [];
    var current_list_ids_data = {};
    eagle_data = [];
    function fromData_Data2(obj_exam, new_date, eagle_t) {
      if (obj_exam.children) {
        obj_exam.children.forEach(function(d){
          if (d.children) {
            fromData_Data2(d, new_date, eagle_t);
          } else  {
              if (current_list_ids_data[new_date].indexOf(d.id_valor) === -1) {
                if (d.valid !== null && typeof(d.valid) != 'undefined') {
                  current_list.push({"id": d.id_valor, "max": d.max, "min": d.min, "valid": d.valid, "value": (d.valor * 1)});
                  current_list_image_links.push({"id": d.id_valor, "max": d.max, "min": d.min, "valid": d.valid, "value": (d.valor * 1), "ref_png": (base_png + d.png_ref)});
                  if (eagle_t === true) {
                    eagle_data.push({"id_valor": d.id_valor, "descr_valor": ("||" + d.name_abbrev), "descr_metodo": d.metodo,"max": d.max, "min": d.min, "valid": d.valid, "value": (d.valor * 1)});
                  }
                } else {
                  current_list.push({"id": d.id_valor});
                  current_list_image_links.push({"id": d.id_valor, "ref_png": (base_png + d.png_ref)});
                  if (eagle_t === true) {
                    eagle_data.push({"id_valor": d.id_valor, "descr_valor": ("||" + d.name_abbrev), "descr_metodo": d.metodo,"max": null, "min": null, "valid": null, "value": (d.valor * 1)});
                  }
                }
            }
          }
        });
      } else {
          if (current_list_ids_data[new_date].indexOf(obj.id_valor) === -1) {
            if (obj.valid !== null && typeof(obj.valid) != 'undefined') {
              current_list.push({"id": obj.id_valor, "max": obj.max, "min": obj.min, "valid": obj.valid, "value": (obj.valor * 1)});
              current_list_image_links.push({"id": obj.id_valor, "max": obj.max, "min": obj.min, "valid": obj.valid, "value": (obj.valor * 1), "ref_png": obj.png_ref});
              if (eagle_t === true) {
                eagle_data.push({"id": obj.id_valor, "descr_valor": ("||" + obj.name_abbrev), "descr_metodo": obj.metodo,"max": obj.max, "min": obj.min, "valid": d.valid, "value": (obj.valor * 1)});
              }
            } else {
              current_list.push({"id": obj.id_valor});
              current_list_image_links.push({"id": obj.id_valor, "ref_png": obj.png_ref});
              if (eagle_t === true) {
                eagle_data.push({"id": obj.id_valor, "descr_valor": ("||" + obj.name_abbrev), "descr_metodo": obj.metodo,"max": null, "min": null, "valid": null, "value": (obj.valor * 1)});
              }
            }
          }
      }
    }

    var eagle_t = true;
    for (var each_obj in full_nodes_map_a) {
      if (full_nodes_map_a.hasOwnProperty(each_obj)) {
        if (full_nodes_map_a[each_obj]["name"].indexOf("Exam_Date") > -1) {
          new_date = full_nodes_map_a[each_obj]["name"].split("_")[0];
          if (examDatas.indexOf(new_date) === -1) {
            current_list_ids_data[new_date] = [];
            data2[new_date] = [];
            data_image_links[new_date] = [];
          }
          examDatas.push(new_date);
          current_list = [];
          current_list_image_links = [];
          fromData_Data2(full_nodes_map_a[each_obj], new_date, eagle_t);
          eagle_t = false;
          data2[new_date] = current_list;
          data_image_links[new_date] = current_list_image_links;
          current_list = [];
          current_list_image_links = [];
        }
      }
    }
    console.log("data2");
    console.log(data2);
    console.log("data_image_links");
    console.log(data_image_links);
    console.log("eagle_data");
    console.log(eagle_data);
    eagle_data = prepareData(eagle_data);
    console.log("eagle_data_parsed");
    console.log(eagle_data);
    console.log("data2");
    console.log(data2);
    old_eagle_data = JSON.parse(JSON.stringify(eagle_data));
    original_EagleData = JSON.parse(JSON.stringify(eagle_data));
    current_EagleData =  JSON.parse(JSON.stringify(original_EagleData));
    parentValidationObject(data); //counts valid data and leaf number. needs data2 loaded
    console.log("parent_object_invalid_counts");
    console.log(parent_object_invalid_counts);
    console.log("parent_object_counts");
    console.log(parent_object_counts);
    return fetch(patient_grouped_data_urls[index_patient],{method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/'+patient_grouped_data_urls[index_patient],
      headers: {'Origin': url_base}}
    ); // make a 2nd request and return a promise
  })
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    hist_data = json; //defined initial history data
    console.log("data_history");
    console.log(hist_data);
    oldHistData = JSON.parse(JSON.stringify(hist_data));
    original_HistData = JSON.parse(JSON.stringify(hist_data));
    current_HistData = JSON.parse(JSON.stringify(original_HistData));
    mapNameToDateHist();
    parentValidationObjectHist(hist_data);
    console.log("hist_parent_object_invalid_counts");
    console.log(hist_parent_object_invalid_counts);
    console.log("hist_parent_object_counts");
    console.log(hist_parent_object_counts);
    return fetch("http://dan-reznik.ocpu.io/AzorPkg2/json/estudos.json",{method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/'+"http://dan-reznik.ocpu.io/AzorPkg2/json/estudos.json",
      headers: {'Origin': url_base}}); // make a 3rd request and return a promise
  })
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    group_data = json; //defined studies data
    initial_render(data, data2, eagle_data);
  })
  ;
}
new_defineDatas(0);

function new_redefineDatas(index_patient) {
  fetch(patient_data_urls[index_patient],{method: 'get',
    url: 'https://cors-anywhere.herokuapp.com/'+patient_data_urls[index_patient],
    headers: {'Origin': url_base}}
  )
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    console.log("Redefined datas!");
    data = json; //defined initial data
    console.log("data");
    console.log(data);
    currentSexa = data.sex;
    d3.select("#patient_name_define").node().innerHTML = data.name;
    d3.select("#patient_phone").node().innerHTML = patients_full_data[index_patient].phone;
    currentSexa = data.sex;
    birthDataa = data.birth_ymd;
    birthYear = parseInt(birthDataa.substr(0, 4));
    birthMonth = parseInt(birthDataa.substr(4, 2)) -1;
    birthDay = parseInt(birthDataa.substr(6, 2));

    var birth_moment = moment(birthDataa, "YYYYMMDD");
    var current_moment = moment();
    var age = current_moment.diff(birth_moment, 'years') + "";
    var sex_text = data.sex === "M" ? "Homem, " : "Mulher, ";
    d3.select("#sex_age").node().innerHTML = sex_text + age;
    console.log("age");
    console.log(age);
    base_png = data.png_ref_base;
    birthDataa = data.birth_ymd;
    base_png = data.png_ref_base;

    oldData = JSON.parse(JSON.stringify(data));
    original_Data = JSON.parse(JSON.stringify(data));
    current_Data = JSON.parse(JSON.stringify(original_Data));
    mapNameToDate();
    //data list should be defined here
    var full_nodes_map_a = {};
    function untangleNodes_a (node) {
      full_nodes_map_a[node.name] = node;
      //recursive on all the children
      node.children && node.children.forEach(untangleNodes_a);
    }
    untangleNodes_a(data);
    console.log("full_nodes_map_a");
    console.log(full_nodes_map_a);
    var new_date;
    var current_list = [];
    var current_list_image_links = [];
    var current_list_ids_data = {};
    eagle_data = [];
    data2 = [];
    data_image_links = [];
    examDatas = [];
    function fromData_Data2(obj_exam, new_date, eagle_t) {
      if (obj_exam.children) {
        obj_exam.children.forEach(function(d){
          if (d.children) {
            fromData_Data2(d, new_date, eagle_t);
          } else  {
              console.log("d");
              console.log(d);
              console.log("current_list_ids_data[new_date]");
              console.log(current_list_ids_data[new_date]);
              if (current_list_ids_data[new_date].indexOf(d.id_valor) === -1) {
                if (d.valid !== null && typeof(d.valid) != 'undefined') {
                  current_list.push({"id": d.id_valor, "max": d.max, "min": d.min, "valid": d.valid, "value": (d.valor * 1)});
                  current_list_image_links.push({"id": d.id_valor, "max": d.max, "min": d.min, "valid": d.valid, "value": (d.valor * 1), "ref_png": (base_png + d.png_ref)});
                  if (eagle_t === true) {
                    eagle_data.push({"id_valor": d.id_valor, "descr_valor": ("||" + d.name_abbrev), "descr_metodo": d.metodo,"max": d.max, "min": d.min, "valid": d.valid, "value": (d.valor * 1)});
                  }
                } else {
                  current_list.push({"id": d.id_valor});
                  current_list_image_links.push({"id": d.id_valor, "ref_png": (base_png + d.png_ref)});
                  if (eagle_t === true) {
                    eagle_data.push({"id_valor": d.id_valor, "descr_valor": ("||" + d.name_abbrev), "descr_metodo": d.metodo,"max": null, "min": null, "valid": null, "value": (d.valor * 1)});
                  }
                }
            }
          }
        });
      } else {
          if (current_list_ids_data[new_date].indexOf(obj.id_valor) === -1) {
            if (obj.valid !== null && typeof(obj.valid) != 'undefined') {
              current_list.push({"id": obj.id_valor, "max": obj.max, "min": obj.min, "valid": obj.valid, "value": (obj.valor * 1)});
              current_list_image_links.push({"id": obj.id_valor, "max": obj.max, "min": obj.min, "valid": obj.valid, "value": (obj.valor * 1), "ref_png": obj.png_ref});
              if (eagle_t === true) {
                eagle_data.push({"id": obj.id_valor, "descr_valor": ("||" + obj.name_abbrev), "descr_metodo": obj.metodo,"max": obj.max, "min": obj.min, "valid": d.valid, "value": (obj.valor * 1)});
              }
            } else {
              current_list.push({"id": obj.id_valor});
              current_list_image_links.push({"id": obj.id_valor, "ref_png": obj.png_ref});
              if (eagle_t === true) {
                eagle_data.push({"id": obj.id_valor, "descr_valor": ("||" + obj.name_abbrev), "descr_metodo": obj.metodo,"max": null, "min": null, "valid": null, "value": (obj.valor * 1)});
              }
            }
          }
      }
    }

    var eagle_t = true;
    for (var each_obj in full_nodes_map_a) {
      if (full_nodes_map_a.hasOwnProperty(each_obj)) {
        if (full_nodes_map_a[each_obj]["name"].indexOf("Exam_Date") > -1) {
          new_date = full_nodes_map_a[each_obj]["name"].split("_")[0];
          if (examDatas.indexOf(new_date) === -1) {
            current_list_ids_data[new_date] = [];
            data2[new_date] = [];
            data_image_links[new_date] = [];
          }
          examDatas.push(new_date);
          current_list = [];
          current_list_image_links = [];
          // console.log(full_nodes_map_a[each_obj]);
          // console.log(full_nodes_map_a[each_obj]);
          fromData_Data2(full_nodes_map_a[each_obj], new_date, eagle_t);
          eagle_t = false;
          data2[new_date] = current_list;
          data_image_links[new_date] = current_list_image_links;
          current_list = [];
          current_list_image_links = [];
        }
      }
    }
    console.log("data2");
    console.log(data2);
    console.log("data_image_links");
    console.log(data_image_links);
    console.log("eagle_data");
    console.log(eagle_data);
    eagle_data = prepareData(eagle_data);
    console.log("eagle_data_parsed");
    console.log(eagle_data);
    console.log("data2");
    console.log(data2);
    old_eagle_data = JSON.parse(JSON.stringify(eagle_data));
    original_EagleData = JSON.parse(JSON.stringify(eagle_data));
    current_EagleData =  JSON.parse(JSON.stringify(original_EagleData));
    parentValidationObject(data); //counts valid data and leaf number. needs data2 loaded
    console.log("parent_object_invalid_counts");
    console.log(parent_object_invalid_counts);
    console.log("parent_object_counts");
    console.log(parent_object_counts);
    return fetch(patient_grouped_data_urls[index_patient],{method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/'+patient_grouped_data_urls[index_patient],
      headers: {'Origin': url_base}}
    );  // make a 2nd request and return a promise
  })
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    hist_data = json; //defined initial history data
    console.log("data_history");
    console.log(hist_data);
    oldHistData = JSON.parse(JSON.stringify(hist_data));
    original_HistData = JSON.parse(JSON.stringify(hist_data));
    current_HistData = JSON.parse(JSON.stringify(original_HistData));
    mapNameToDateHist();
    parentValidationObjectHist(hist_data);
    console.log("hist_parent_object_invalid_counts");
    console.log(hist_parent_object_invalid_counts);
    console.log("hist_parent_object_counts");
    console.log(hist_parent_object_counts);
    return fetch("http://dan-reznik.ocpu.io/AzorPkg2/json/estudos.json",{method: 'get',
      url: 'https://cors-anywhere.herokuapp.com/'+"http://dan-reznik.ocpu.io/AzorPkg2/json/estudos.json",
      headers: {'Origin': url_base}}); // make a 3rd request and return a promise
  })
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    group_data = json; //defined studies data
    svg2.selectAll("*").remove();
    d3.select("history-svg").selectAll("*").remove();
    d3.select("tree-svg").selectAll("*").remove();
    draw_svg_tree(data);
    draw_svg_hist(hist_data);
    draw_svg_eagle(eagle_data);
    draw_exams();
    showTree();
  })
  ;
}
// Initial data render
let initial_render = function(v_data, v_data2, v_eagle_data) {
  draw_svg_tree(v_data);
  draw_svg_hist(v_data);
  draw_svg_eagle(v_eagle_data, true);
  draw_exams();
  showTree();
}

let toggleFloat;

let renderTreeControls;
  let current_search = "";
let showTreeControls;
let renderTree;
  let last_selected;

let showTree;

let renderHistTreeControls;
  let current_history_search = "";
let showHistTreeControls;
let showHistTree;
let renderHistTree;
  let last_selected_hist;

let renderEaglecontrols;
  let current_eagle_search = "";
let showEagleControls;
let showEagle;

let renderExamscontrols;
let showExamsControls;
let showExams;

// Intialize controls

// Black top click on logo image page reload
document.getElementById('logoimage').setAttribute("onclick", "window.location.href=window.location.href");

function setDoctorName() {
  function getQueryParams(qs) {
      qs = qs.split('+').join(' ');
      var params = {},
          tokens,
          re = /[?&]?([^=]+)=([^&]*)/g;
      while (tokens = re.exec(qs)) {
          params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      }
      return params;
  }

  function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var query = getQueryParams(document.location.search);
  var final_name = [];
  query.username.split("_").forEach(function(word) {
    var not_return = ["do","da","de","dos","das"];
    if (word.length > 2 && not_return.indexOf(word) === -1) {
      final_name.push(jsUcfirst(word));
    } else {
      final_name.push(word);
    }
  });
  final_name = final_name.join(" ");
  final_name = final_name.replace(",", " ");
  final_name = final_name.replace("\/", "");
  document.getElementById("doctorname").innerHTML = "Dr. " + final_name;
}
setDoctorName();

function ScaleReCaptcha() {
    if (document.getElementById('recaptchadiv')) {
    // parentWidth = document.getElementById('recaptchadiv').parentNode.clientWidth;
    parentWidth = document.getElementById('emailinp').clientWidth;
    childWidth = document.getElementById('recaptchadiv').firstChild.clientWidth;
    scale = (parentWidth) / (childWidth);
    new_width = childWidth * scale;
    // document.getElementById('recaptchadiv').style.transform = 'scale(' + scale + ')';
    // document.getElementById('recaptchadiv').style.transformOrigin = 'center';
    document.getElementById('recaptchadiv').parentNode.style.transform = 'scale(' + scale + ')';
    document.getElementById('recaptchadiv').parentNode.style.transformOrigin = '0 0';
    document.getElementById('recaptchadiv').style.setAttribute('-ms-transform', 'scale(' + scale + ')');
    document.getElementById('recaptchadiv').style.setAttribute('-webkit-transform', 'scale(' + scale + ')');

    // document.getElementById('recaptchadiv').firstChild.style.width = new_width + "px";
    document.getElementById('recaptchadiv').parentNode.width = new_width + "px";
    // document.getElementById('recaptchadiv').firstChild.setAttribute('width', new_width);
  }
}

window.onresize = function() {
  // Do something.
  update(root);
  ScaleReCaptcha();
}

function updateEagleAjax() {
  var previous_eagle = JSON.parse(JSON.stringify(eagle_data));
  for (var each_data in data2) {
    if (data2.hasOwnProperty(each_data)) {
      // var new_date = examDatas[index];
      var new_data = data2[each_data];
      var previous_eagle = JSON.parse(JSON.stringify(eagle_data));
      var new_eagle = [];
      for (var i = 0; i < new_data.length; i++) {
        var new_data_obj = new_data[i];
        for (var j = 0; j < previous_eagle.length; j++) {
          if (previous_eagle[j].id_valor === new_data[i].id) {
            var prev_obj = previous_eagle[j];
            new_eagle.push({"id_valor": prev_obj.id_valor, "descr_valor": prev_obj.descr_valor, "descr_metodo": prev_obj.descr_metodo,"max": new_data_obj.max, "min": new_data_obj.min, "valid": prev_obj.valid, "value": prev_obj.value});
          }
        }
      }
      new_eagle = prepareData(new_eagle);
      eagle_data = JSON.parse(JSON.stringify(new_eagle));
      original_EagleData = JSON.parse(JSON.stringify(new_eagle));
      current_EagleData = JSON.parse(JSON.stringify(new_eagle));
      draw_svg_eagle(new_eagle, true);
      fora = false;
      update_dots = false;
      chkUpdate();
      break;
    }
  }
}

let birthYear;
let birthMonth;
let birthDay;
var birth_picker;

var requestThisCallback;
function initBirth() {
  birth_picker = new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'DD/MM/YYYY',
    minDate:  new Date(1910,0,01),
    maxDate:  moment().toDate(),
    defaultDate: new Date(birthYear,birthMonth,birthDay),
    setDefaultDate: true,
    onSelect: function(date) {
      birthDataa = this.getMoment().format('YYYYMMDD');
      birthYear = parseInt(birthDataa.substr(0, 4));
      birthMonth = parseInt(birthDataa.substr(4, 2)) -1;
      birthDay = parseInt(birthDataa.substr(6, 2));

      //run function to update tree
      var birth_date_to_send = this.getMoment().format('YYYYMMDD');
      data_image_links = {};
      document.getElementById('loadingDiv').classList.remove('d-none');

      requestThisCallback = new MyRequestsCompleted({
          numRequest: examDatas.length,
          singleCallback: function(){
            parent_object_counts = {};
            parent_object_invalid_counts = {};
            hist_parent_object_counts = {};
            hist_parent_object_invalid_counts = {};
            parentValidationObject(data); //counts valid data and leaf number. needs data2 loaded
            parentValidationObjectHist(hist_data); //counts valid data and leaf number. needs data2 loaded
            runImageAjax();
            // parseData2Object();
          }
      });
      updateData2Object();
      // console.log("requestCallback");
      // console.log(requestCallback);
      document.getElementById('loadingDiv').classList.add('d-none');
    },
  });
}

var rad = document.getElementsByName("exampleRadios");
var prev = null;
for(var i = 0; i < rad.length; i++) {
  rad[i].onclick = function() {
    (prev)? console.log(prev.value):null;
    if(this !== prev) {
      prev = this;
      currentSexa = $("input[name=exampleRadios]:checked").val() === "masculino" ? "M" : "F";
      document.getElementById('loadingDiv').classList.remove('d-none');
      console.log("birthDataa");
      console.log(birthDataa);
      birthDataa = birth_picker.getMoment().format('YYYYMMDD');
      console.log("birthDataa");
      console.log(birthDataa);

      birthYear = parseInt(birthDataa.substr(0, 4));
      birthMonth = parseInt(birthDataa.substr(4, 2)) -1;
      birthDay = parseInt(birthDataa.substr(6, 2));

      //run function to update tree
      var birth_date_to_send = birth_picker.getMoment().format('YYYYMMDD');
      data_image_links = {};
      document.getElementById('loadingDiv').classList.remove('d-none');

      requestThisCallback = new MyRequestsCompleted({
          numRequest: examDatas.length,
          singleCallback: function(){
            parent_object_counts = {};
            parent_object_invalid_counts = {};
            hist_parent_object_counts = {};
            hist_parent_object_invalid_counts = {};
            parentValidationObject(data); //counts valid data and leaf number. needs data2 loaded
            parentValidationObjectHist(hist_data); //counts valid data and leaf number. needs data2 loaded
            runImageAjax();
            // parseData2Object();
          }
      });
      updateData2Object();
      // console.log("requestCallback");
      // console.log(requestCallback);
      document.getElementById('loadingDiv').classList.add('d-none');
      document.getElementById('loadingDiv').classList.add('d-none');
    }
    if (this.value === "feminino") {
      document.getElementById('checkboxgravida').classList.remove("d-none");
      document.getElementsByClassName('grid-content')[0].classList.add('grid-content2');
    } else {
      document.getElementById('checkboxgravida').classList.add("d-none");
      document.getElementsByClassName('grid-content')[0].classList.remove('grid-content2');
    }
  }
}

var focusedElement3 = null;
$( "#additionalcontrols" ).click(function() {
    focusedElement3 = document.getElementById('additionalcontrols');
    document.getElementById('additionalcontrols').classList.remove("half-transparent");
    window.addEventListener('click', setWindowClickListener4);
});

$( function() {
    var widths = [];
    $('#additionalcontrols').children().each(function(i){
      widths[i] = $(this).width();
    });
    widths.push($('#additionalcontrols').width());
    // document.getElementById('additionalcontrols').style.width = (Math.max.apply(Math, widths) + 10) + "px";
    document.getElementById('additionalcontrols').style.width = "10vw";
    $( "#additionalcontrols" ).draggable({
      // containment: [-1000, -1000, $('body').innerWidth() + 1000, $('body').innerHeight() + 1000],
      // containment: [0, $('.top-panel').outerHeight() + $('#second-top-panel').outerHeight(), $('body').innerWidth(), $('body').innerHeight()],
      containment: $('body'),
      // axis: "x",
      // helper: 'clone',
      start: function(event, ui){
        // console.log("start!");
        // document.getElementById('additionalcontrols').classList.remove("half-transparent");
        // window.addEventListener('click', setWindowClickListener4);
        // $(ui.helper).css('width', `${ (Math.max.apply(Math, widths) + 10) }px`);
        $(ui.helper).css('width', `10vw`);
        $(ui.helper).css('bottom', `unset`);
      }
    });
} );


// Black top click on user icon hide float
let toggle_float_bool = false;
toggleFloat = function() {
  if (toggle_float_bool === false) {
    //highlight button
    document.getElementById("show_toggle_btn").classList.add("border-but");
    document.getElementById("additionalcontrols").classList.add("d-none");
  } else {
    //remove highlight
    document.getElementById("show_toggle_btn").classList.remove("border-but");
    document.getElementById("additionalcontrols").classList.remove("d-none");
  }
  toggle_float_bool = !toggle_float_bool;
};

var setWindowClickListener4 = function(e) {
  if (e.target !== focusedElement3) {
    var flag_run = true;
    //make this recursive
    function checkRecursive(curel) {
      if (e.target === curel) {
        flag_run = false;
      }
      if (curel.children) {
        for (var i = 0; i < curel.children.length; i++) {
          var c = curel.children[i];
          if (e.target === c) {
            flag_run = false;
          }
          if (c && c.children) {
            checkRecursive(c);
          }
        };
      }
    }
    checkRecursive(focusedElement3);
    if (flag_run === true) {
      document.getElementById('additionalcontrols').classList.add("half-transparent");
      window.removeEventListener('click', setWindowClickListener4);
    };
  }
};

var setWindowClickListener2 = function(e) {
  var focusedBtn = document.getElementById("contact-btn");
  var focusedBtn2 = document.getElementById("send-mail-btn");
  var focusedSpan = document.getElementById('span1');
  var focusedSpan2 = document.getElementById('span2');
  if (e.target !== focusedElement2 && e.target !== focusedBtn && e.target !== focusedSpan && e.target !== focusedBtn2 && e.target !== focusedSpan2) {
    console.log(e.target);
    var flag_do = true;
    for (var i = 0; i < focusedElement2.children.length; i++) {
      if (e.target === focusedElement2.children[i]) {
        flag_do = false;
      }
    }
    for (var i = 0; i < document.getElementsByClassName('contact-form')[0].children.length; i++) {
      if (e.target === document.getElementsByClassName('contact-form')[0].children[i]) {
        flag_do = false;
      }
    }
    if (flag_do === true) {
      console.log("deleting");
      document.getElementById('dropup').classList.add("d-none");
      // document.getElementById('dropup').classList.add("half-transparent");
      window.removeEventListener('click', setWindowClickListener2);
      dropedup = false;
    }
  }
}

var setWindowClickListener3 = function(e) {
  var focusedBtn = document.getElementById("contact-btn");
  var focusedSpan = document.getElementById('span1');
  if (e.target !== focusedElement2 && e.target !== focusedBtn && e.target !== focusedSpan) {
    var flag_do = true;
    for (var i = 0; i < focusedElement2.children.length; i++) {
      if (e.target === focusedElement2.children[i]) {
        flag_do = false;
      }
    }
    for (var i = 0; i < document.getElementsByClassName('contact-form')[0].children.length; i++) {
      if (e.target === document.getElementsByClassName('contact-form')[0].children[i]) {
        flag_do = false;
      }
    }
    if (flag_do === true) {
      document.getElementById('dropup').classList.add("half-transparent");
    } else {
      document.getElementById('dropup').classList.remove("half-transparent");
    }
  }
}


var focusedElement2;
var dropedup = false;
function showDropUp() {
  if (dropedup === false) {
    document.getElementById('dropup').classList.remove("d-none");
    focusedElement2 = document.getElementById('dropup');
    // document.getElementById('dropup').classList.remove("half-transparent");
    window.addEventListener('click', setWindowClickListener2);
    // window.addEventListener('click', setWindowClickListener3);
    dropedup = true;
  } else {
    document.getElementById('dropup').classList.add("d-none");
    // document.getElementById('dropup').classList.remove("half-transparent");
    window.removeEventListener('click', setWindowClickListener2);
    // window.removeEventListener('click', setWindowClickListener3);
    dropedup = false;
  }
  ScaleReCaptcha();
}


var onloadCallback = function() {
  console.log("grecaptcha is ready!");
  var myCaptcha = true;
  myCaptcha = grecaptcha.render(document.getElementById('recaptchadiv'), {"sitekey": "6Lfro2MUAAAAAHjdSI6IvDPHi8oak25hHz15o9g0", "theme": "light", 'callback' : allowMail, "expired-callback": disallowMail});
  // ScaleReCaptcha();
};

var doneCaptcha = false;
function allowMail() {
  // document.getElementById('contact_formulary').classList.add('contact-form-extended');
  doneCaptcha = true;
}

function disallowMail() {
  // document.getElementById('contact_formulary').classList.add('contact-form-extended');
  doneCaptcha = false;
}

function doCaptcha() {
  // document.getElementById('contact_formulary').classList.add('contact-form-extended');
  if  (myCaptcha === null) {
    myCaptcha = grecaptcha.render(document.getElementById('recaptchadiv'), {"sitekey": "6Lfro2MUAAAAAHjdSI6IvDPHi8oak25hHz15o9g0", "theme": "light", 'callback' : allowMail, "expired-callback": disallowMail});
  } else {
    grecaptcha.reset(myCaptcha);
  }
}

function sendMail() {
    if (doneCaptcha === true) {
      showDropUp();
      // document.getElementById('splash-contactdiv').classList.add("d-none");
      var link = "mailto:dan^_^azordiagnostics.com".replace('^_^', '@')
              //  + "?cc=myCCaddress@example.com"
              + "?subject=" + escape("Contato Azor - Nome: " + document.getElementById('nameinp').value)
              + "&body=" + escape(document.getElementById('msginp').value)
              ;
              window.location.href = link;
              grecaptcha.reset(myCaptcha);
              doneCaptcha = false;
      }
}

document.getElementById('show_toggle_btn').setAttribute("onclick", "toggleFloat()");

// Delay function for search
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

//Filters nodes by search on tree
function doTreeSearch(current_Data) {
  current_search = document.getElementById("search_input").value;
  if (document.getElementById("search_input").value.length > 1) {
    var resultsBusca = minhaBusca(current_Data);
    var search_Data = resultsBusca[0];
    var search_Data_Objs = resultsBusca[1];
    var search_Data_Uniques = resultsBusca[2];
    var filtered = filter_function2([original_Data], search_Data_Uniques);
    if (!filtered[0]) {
      tree_root = tree(hierarchy(current_Data)); //passed by function
      tree_root.each(function (d) {
          d.name_to_print = d.id; //transferring name to a name variable
          d.id = tree_i; //Assigning numerical Ids
          tree_i++;
      });
      tree_root.x0 = tree_root.x;
      tree_root.y0 = tree_root.y;
      tree_expand(tree_root);
      tree_update(tree_root);
    } else  {
      tree_root = tree(hierarchy(filtered[0])); //passed by function
      tree_root.each(function (d) {
          d.name_to_print = d.id; //transferring name to a name variable
          d.id = tree_i; //Assigning numerical Ids
          tree_i++;
      });
      tree_root.x0 = tree_root.x;
      tree_root.y0 = tree_root.y;
      tree_root.children.forEach(tree_collapseSpecific);
      // expand(root);
      tree_update(tree_root);
    }
  } else {
    //reset groups?
    tree_root = tree(hierarchy(current_Data)); //passed by function
    tree_root.each(function (d) {
        d.name_to_print = d.id; //transferring name to a name variable
        d.id = tree_i; //Assigning numerical Ids
        tree_i++;
    });
    tree_root.x0 = tree_root.x;
    tree_root.y0 = tree_root.y;
    tree_expand(tree_root);
    tree_update(tree_root);
  }
}

// Resets Tree to First Level
function resetTreeFirstLevel(original_Data) {
  document.getElementById("search_input").value = "";
  $('.js-select2').val(null).trigger("change");
  last_selected = null;
  filtering_active = false;
  tree_clicked_bool = false;
  tree_root = tree(hierarchy(original_Data)); //passed by function
  current_Data = JSON.parse(JSON.stringify(original_Data));
  tree_root.each(function (d) {
      d.name_to_print = d.id; //transferring name to a name variable
      d.id = tree_i; //Assigning numerical Ids
      tree_i++;
  });
  tree_root.x0 = tree_root.x;
  tree_root.y0 = tree_root.y;
  tree_root.children.forEach(tree_collapseLevel);
  tree_update(tree_root);
  window.scrollTo(0,0);
}

// Expands whole current tree
function resetTreeExpand(original_Data) {
  document.getElementById("search_input").value = "";
  $('.js-select2').val(null).trigger("change");
  last_selected = null;
  filtering_active = false;
  tree_clicked_bool = false;
  tree_root = tree(hierarchy(original_Data)); //passed by function
  current_Data = JSON.parse(JSON.stringify(original_Data));
  tree_root.each(function (d) {
      d.name_to_print = d.id; //transferring name to a name variable
      d.id = tree_i; //Assigning numerical Ids
      tree_i++;
  });
  tree_root.x0 = tree_root.x;
  tree_root.y0 = tree_root.y;
  tree_expand(tree_root);
  tree_update(tree_root);
  window.scrollTo(0,0);
}

// Filters Tree only to Invalid Nodes
function filterTreeExpand(original_Data, lookup) {
  filtering_active = true;
  tree_clicked_bool = false;
  document.getElementById('search_input').value = "";
  $('.js-select2').val(null).trigger("change");
  last_selected = null;
  var minhaFiltragem_results = minhaFiltragem(original_Data);
  var filter_Data = minhaFiltragem_results[0];
  var filter_Data_Objs = minhaFiltragem_results[1];
  var filter_Data_Uniques = minhaFiltragem_results[2];
  var filtered = filter_function2([original_Data], filter_Data_Uniques);
  current_Data = JSON.parse(JSON.stringify(filtered[0]));
  tree_root = tree(hierarchy(current_Data)); //passed by function
  tree_root.each(function (d) {
      d.name_to_print = d.id; //transferring name to a name variable
      d.id = tree_i; //Assigning numerical Ids
      tree_i++;
  });
  tree_root.x0 = tree_root.x;
  tree_root.y0 = tree_root.y;
  tree_expand(tree_root);
  tree_update(tree_root);
  window.scrollTo(0,0);
}

// Filters by groups
function selection_tree(this_index) {
  document.getElementById("search_input").value = "";
  current_Data = JSON.parse(JSON.stringify(original_Data));
  //first filter original data and its children
  var id_valor_list = group_data[this_index].ids;

  if (id_valor_list.constructor !== Array) {
    id_valor_list = [id_valor_list];
  }
  // console.log(id_valor_list);

  var this_lookup = [];
  var this_name_list = [];
  var child_vericity;
  function searchIntoChildren(node) {
    if (node.children) {
      node.children.forEach(function(d) {
        if (d.children) {
          searchIntoChildren(d);
        } else {
          if (id_valor_list.indexOf(d.id_valor) > -1) {
            child_vericity = true;
          }
        }
      });
    } else {
      if (id_valor_list.indexOf(node.id_valor) > -1) {
        child_vericity = true;
      }
    }
  };

  function doThisMapping(node) {
    this_lookup[node.name] = node;
    if (node.children) {
      child_vericity = false;
      searchIntoChildren(node);
      if (child_vericity === true) {
        if (this_name_list.indexOf(node.name) === -1) {
          this_name_list.push(node.name);
        }
      }
    } else {
      if (id_valor_list.indexOf(node.id_valor) > -1) {
        if (this_name_list.indexOf(node.name) === -1) {
          this_name_list.push(node.name);
        }
      }
    }
    //recursive on all the children
    node.children && node.children.forEach(doThisMapping);
  }

  doThisMapping(original_Data);
  // console.log("this_name_list");
  // console.log(this_name_list);
  //generates list of names corresponding to the passed ids
  if (this_name_list.length > 1) {
    var filtered = filter_function2([original_Data], this_name_list);
    tree_root = tree(hierarchy(filtered[0])); //passed by function
    current_Data = filtered[0];
    tree_root.each(function (d) {
        d.name_to_print = d.id; //transferring name to a name variable
        d.id = tree_i; //Assigning numerical Ids
        tree_i++;
    });
    tree_root.x0 = tree_root.x;
    tree_root.y0 = tree_root.y;
    tree_expand(tree_root);
    tree_update(tree_root);
  }
  window.scrollTo(0,0);
}

//Render Tree view controls
renderTreeControls = function() {
  var exames = document.getElementById('exames');
  var second_top_panel = document.getElementById('second-top-panel');
  var controls = document.getElementById('controls-div');
  controls.classList.remove("controls-eagle");
  controls.classList.add("controls-tree");
  controls.classList.remove("controls-exams");
  //controls should be cleared here
  var myNode = document.getElementById("controls-div");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }

  var search_div = document.createElement("div");
  search_div.id = "search_div";
  search_div.classList.add("search-inside");

  var search_input = document.createElement("input");
  search_input.type = "search";
  search_input.id = "search_input";
  search_input.classList.add("search_input_class");
  if (current_search) {
    search_input.value = current_search;
  }

  var search_icon = document.createElement("i")
  search_icon.classList.add("fa");
  search_icon.classList.add("fa-search");
  search_icon.id = "search_icon";

  search_div.appendChild(search_icon);
  search_div.appendChild(search_input);
  // search_div.setAttribute("onKeyUp", "doTreeSearch(current_Data)");


  var levelone = document.createElement("button");
  levelone.id = "leveloneref_tree";
  levelone.classList.add("but2");
  levelone.classList.add("btn");
  levelone.classList.add("common-buttons");
  levelone.setAttribute("onClick", "resetTreeFirstLevel(original_Data)");

  var levelonespan = document.createElement("span");
  levelonespan.id = "leveloneref_tree-text";
  levelonespan.innerHTML = "1º Nível";
  levelonespan.classList.add("common-buttons-text");
  levelone.appendChild(levelonespan);

  var all_tree = document.createElement("button");
  all_tree.id = "all_tree";
  all_tree.classList.add("but2");
  all_tree.classList.add("btn");
  all_tree.classList.add("common-buttons");
  all_tree.setAttribute("onClick", "resetTreeExpand(original_Data)");

  var all_treespan = document.createElement("span");
  all_treespan.id = "all_tree-text";
  all_treespan.innerHTML = "Todos";
  all_treespan.classList.add("common-buttons-text");
  all_tree.appendChild(all_treespan);

  var outsideref = document.createElement("button");
  outsideref.id = "outsideref_tree";
  outsideref.classList.add("but2");
  outsideref.classList.add("btn");
  outsideref.classList.add("common-buttons");
  outsideref.setAttribute("onClick", "filterTreeExpand(original_Data, lookup)");

  var outsiderefspan = document.createElement("span");
  outsiderefspan.id = "outsideref_tree-text";
  outsiderefspan.innerHTML = "Fora da Faixa";
  outsiderefspan.classList.add("common-buttons-text");

  outsideref.appendChild(outsiderefspan);

  var selectgroups = document.createElement("select");
  selectgroups.name = "groupings";
  selectgroups.classList.add("js-select2")

  controls.appendChild(search_div);
  controls.appendChild(levelone);
  controls.appendChild(all_tree);
  controls.appendChild(outsideref);
  controls.appendChild(selectgroups);

  $('#search_input').keyup(function() {
    delay(function(){
      // alert('Time elapsed!');
      doTreeSearch(current_Data);
    }, 250 );
  });

}

// Fills Select2 with Groups
function tree_fillselect2() {
  var newOption = new Option("Reset", "_", false, false);
  $('.js-select2').append(newOption).trigger('change');
  for (var i = 0; i < group_data.length; i++) {
    var this_gobj = group_data[i];
    // var newOption = new Option(this_gobj.estudo, i, false, false);
    var newOption = new Option(this_gobj.nome_estudo, i, false, false);
    $('.js-select2').append(newOption).trigger('change');
  }
  $('.select2-container').width('82%');
  // selection();
}

//Show Tree view in Section and change controls
showTree = function() {
  renderTreeControls();
  // showTreeControls();
  $('.js-select2').prepend('<option></option>').select2({placeholder: "Estudos"}).on('select2:select', function (e) {
    if (e.target.value === "_") {
      resetTreeExpand(original_Data);
    } else if (e.target.value >= 0) {
      selection_tree(e.target.value);
    }
    last_selected = e.target.value;
  });
  tree_fillselect2();
  $('.js-select2').val(last_selected).trigger('change');
  window.scrollTo(0,0);
  document.getElementById('imagescarrousel').classList.add('d-none');
  document.getElementById('eagle_container').classList.add('d-none');
  document.getElementById('history').classList.add('d-none');

  document.getElementById('doctor').classList.remove('d-none');

  document.getElementById('tree-icon').classList.add('d-none');
  document.getElementById('tree-icon2').classList.remove('d-none');
  document.getElementById('eagle-icon').classList.remove('d-none');
  document.getElementById('eagle-icon2').classList.add('d-none');
  document.getElementById('exams-icon').classList.remove('d-none');
  document.getElementById('exams-icon2').classList.add('d-none');
  document.getElementById('hist-icon').classList.remove('d-none');
  document.getElementById('hist-icon2').classList.add('d-none');
}
document.getElementById('divt1').setAttribute("onclick", "showTree()");

// Delay function for search
var delay2 = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

//Filters nodes by search on tree
function doSearchHist(current_HistData) {
  current_history_search = document.getElementById("search_input_history").value;
  if (document.getElementById("search_input_history").value.length > 1) {
    var resultsBusca = minhaBusca(current_HistData, true);
    var search_Data = resultsBusca[0];
    var search_Data_Objs = resultsBusca[1];
    var search_Data_Uniques = resultsBusca[2];
    var filtered = filter_function2([original_HistData], search_Data_Uniques);
    if (!filtered[0]) {
      hist_root = tree(hierarchy(current_HistData)); //passed by function
      hist_root.each(function (d) {
          d.name_to_print = d.id; //transferring name to a name variable
          d.id = hist_i; //Assigning numerical Ids
          hist_i++;
      });
      hist_root.x0 = hist_root.x;
      hist_root.y0 = hist_root.y;
      hist_expand(hist_root);
      hist_expand(hist_root);
    } else  {
      hist_root = tree(hierarchy(filtered[0])); //passed by function
      hist_root.each(function (d) {
          d.name_to_print = d.id; //transferring name to a name variable
          d.id = hist_i; //Assigning numerical Ids
          hist_i++;
      });
      hist_root.x0 = hist_root.x;
      hist_root.y0 = hist_root.y;
      hist_root.children.forEach(hist_collapseSpecific);
      // expand(root);
      hist_update(hist_root);
    }
  } else {
    //reset groups?
    hist_root = tree(hierarchy(current_HistData)); //passed by function
    hist_root.each(function (d) {
        d.name_to_print = d.id; //transferring name to a name variable
        d.id = hist_i; //Assigning numerical Ids
        hist_i++;
    });
    hist_root.x0 = hist_root.x;
    hist_root.y0 = hist_root.y;
    hist_expand(hist_root);
    hist_update(hist_root);
  }
}

// Resets Tree to First Level
function resetHistTreeFirstLevel(original_HistData) {
  document.getElementById("search_input_history").value = "";
  $('.js-select2_hist').val(null).trigger("change");
  last_selected_hist = null;
  filtering_active_hist = false;
  hist_clicked_bool = false;
  hist_root = tree(hierarchy(original_HistData)); //passed by function
  current_HistData = JSON.parse(JSON.stringify(original_HistData));
  hist_root.each(function (d) {
      d.name_to_print = d.id; //transferring name to a name variable
      d.id = hist_i; //Assigning numerical Ids
      hist_i++;
  });
  hist_root.x0 = hist_root.x;
  hist_root.y0 = hist_root.y;
  hist_root.children.forEach(hist_collapseLevel);
  hist_update(hist_root);
  window.scrollTo(0,0);
}

// Expands whole current History tree
function resetHistTreeExpand(original_HistData) {
  document.getElementById("search_input_history").value = "";
  $('.js-select2_hist').val(null).trigger("change");
  last_selected_hist = null;
  filtering_active_hist = false;
  hist_clicked_bool = false;
  hist_root = tree(hierarchy(original_HistData)); //passed by function
  current_HistData = JSON.parse(JSON.stringify(original_HistData));
  hist_root.each(function (d) {
      d.name_to_print = d.id; //transferring name to a name variable
      d.id = hist_i; //Assigning numerical Ids
      hist_i++;
  });
  hist_root.x0 = hist_root.x;
  hist_root.y0 = hist_root.y;
  hist_expand(hist_root);
  hist_update(hist_root);
  window.scrollTo(0,0);
}

// Filters Tree only to Invalid Nodes
function filterHistTreeExpand(original_HistData, hist_lookup) {
  filtering_active_hist = true;
  hist_clicked_bool = false;
  document.getElementById('search_input_history').value = "";
  $('.js-select2_hist').val(null).trigger("change");
  last_selected_hist = null;
  var minhaFiltragem_results = minhaFiltragem(original_HistData, true);
  var filter_Data = minhaFiltragem_results[0];
  var filter_Data_Objs = minhaFiltragem_results[1];
  var filter_Data_Uniques = minhaFiltragem_results[2];
  // console.log("filter_Data_Uniques");
  // console.log(filter_Data_Uniques);
  var filtered = filter_function2([original_HistData], filter_Data_Uniques);
  current_HistData = JSON.parse(JSON.stringify(filtered[0]));
  hist_root = tree(hierarchy(current_HistData)); //passed by function
  hist_root.each(function (d) {
      d.name_to_print = d.id; //transferring name to a name variable
      d.id = hist_i; //Assigning numerical Ids
      hist_i++;
  });
  hist_root.x0 = hist_root.x;
  hist_root.y0 = hist_root.y;
  hist_expand(hist_root);
  hist_update(hist_root);
  window.scrollTo(0,0);
}

// Filters by groups
function selection_hist(this_index) {
  document.getElementById("search_input_history").value = "";
  current_HistData = JSON.parse(JSON.stringify(original_HistData));
  //first filter original data and its children
  var id_valor_list = group_data[this_index].ids;

  if (id_valor_list.constructor !== Array) {
    id_valor_list = [id_valor_list];
  }
  // console.log(id_valor_list);

  var this_lookup = [];
  var this_name_list = [];
  var child_vericity;
  function searchIntoChildren(node) {
    if (node.children) {
      node.children.forEach(function(d) {
        if (d.children) {
          searchIntoChildren(d);
        } else {
          if (id_valor_list.indexOf(d.id_valor) > -1) {
            child_vericity = true;
          }
        }
      });
    } else {
      if (id_valor_list.indexOf(node.id_valor) > -1) {
        child_vericity = true;
      }
    }
  };

  function doThisMapping(node) {
    this_lookup[node.name] = node;
    if (node.children) {
      child_vericity = false;
      searchIntoChildren(node);
      if (child_vericity === true) {
        if (this_name_list.indexOf(node.name) === -1) {
          this_name_list.push(node.name);
        }
      }
    } else {
      if (id_valor_list.indexOf(node.id_valor) > -1) {
        if (this_name_list.indexOf(node.name) === -1) {
          this_name_list.push(node.name);
        }
      }
    }
    //recursive on all the children
    node.children && node.children.forEach(doThisMapping);
  }

  doThisMapping(original_HistData);
  // console.log("this_name_list");
  // console.log(this_name_list);
  //generates list of names corresponding to the passed ids
  if (this_name_list.length > 1) {
    var filtered = filter_function2([original_HistData], this_name_list);
    hist_root = tree(hierarchy(filtered[0])); //passed by function
    current_HistData = filtered[0];
    hist_root.each(function (d) {
        d.name_to_print = d.id; //transferring name to a name variable
        d.id = hist_i; //Assigning numerical Ids
        hist_i++;
    });
    hist_root.x0 = hist_root.x;
    hist_root.y0 = hist_root.y;
    hist_expand(hist_root);
    hist_update(hist_root);
  }
  window.scrollTo(0,0);
}

//Render History Tree view controls
renderHistTreeControls = function() {
  var exames = document.getElementById('exames');
  var second_top_panel = document.getElementById('second-top-panel');
  var controls = document.getElementById('controls-div');
  controls.classList.remove("controls-eagle");
  controls.classList.add("controls-tree");
  controls.classList.remove("controls-exams");
  //controls should be cleared here
  var myNode = document.getElementById("controls-div");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }

  var search_div = document.createElement("div");
  search_div.id = "search_div";
  search_div.classList.add("search-inside");

  var search_input = document.createElement("input");
  search_input.type = "search";
  search_input.id = "search_input_history";
  search_input.classList.add("search_input_class");
  if (current_history_search) {
    search_input.value = current_history_search;
  }

  var search_icon = document.createElement("i")
  search_icon.classList.add("fa");
  search_icon.classList.add("fa-search");
  search_icon.id = "search_icon";

  search_div.appendChild(search_icon);
  search_div.appendChild(search_input);
  // search_div.setAttribute("onKeyUp", "doSearchHist(current_HistData)");


  var levelone = document.createElement("button");
  levelone.id = "leveloneref_tree";
  levelone.classList.add("but2");
  levelone.classList.add("btn");
  levelone.classList.add("common-buttons");
  levelone.setAttribute("onClick", "resetHistTreeFirstLevel(original_HistData)");

  var levelonespan = document.createElement("span");
  levelonespan.id = "leveloneref_tree-text";
  levelonespan.innerHTML = "1º Nível";
  levelonespan.classList.add("common-buttons-text");
  levelone.appendChild(levelonespan);

  var all_tree = document.createElement("button");
  all_tree.id = "all_tree";
  all_tree.classList.add("but2");
  all_tree.classList.add("btn");
  all_tree.classList.add("common-buttons");
  all_tree.setAttribute("onClick", "resetHistTreeExpand(original_HistData)");

  var all_treespan = document.createElement("span");
  all_treespan.id = "all_tree-text";
  all_treespan.innerHTML = "Todos";
  all_treespan.classList.add("common-buttons-text");
  all_tree.appendChild(all_treespan);

  var outsideref = document.createElement("button");
  outsideref.id = "outsideref_tree";
  outsideref.classList.add("but2");
  outsideref.classList.add("btn");
  outsideref.classList.add("common-buttons");
  outsideref.setAttribute("onClick", "filterHistTreeExpand(original_HistData, hist_lookup)");

  var outsiderefspan = document.createElement("span");
  outsiderefspan.id = "outsideref_tree-text";
  outsiderefspan.innerHTML = "Fora da Faixa";
  outsiderefspan.classList.add("common-buttons-text");

  outsideref.appendChild(outsiderefspan);

  var selectgroups = document.createElement("select");
  selectgroups.name = "groupings";
  selectgroups.classList.add("js-select2_hist")

  controls.appendChild(search_div);
  controls.appendChild(levelone);
  controls.appendChild(all_tree);
  controls.appendChild(outsideref);
  controls.appendChild(selectgroups);

  $('#search_input_history').keyup(function() {
    delay2(function(){
      // alert('Time elapsed!');
      doSearchHist(current_HistData);
    }, 250 );
  });
}

function hist_fillselect2() {
  var newOption = new Option("Reset", "_", false, false);
  $('.js-select2_hist').append(newOption).trigger('change');
  for (var i = 0; i < group_data.length; i++) {
    var this_gobj = group_data[i];
    var newOption = new Option(this_gobj.nome_estudo, i, false, false);
    $('.js-select2_hist').append(newOption).trigger('change');
  }
  // selection();
  $('.select2-container').width('82%');
}

//Show History Tree view in Section and change controls
showHistTree = function() {
  renderHistTreeControls();
  // showTreeControls();
  $('.js-select2_hist').prepend('<option></option>').select2({placeholder: "Estudos"}).on('select2:select', function (e) {
    if (e.target.value === "_") {
      resetHistTreeExpand(original_HistData);
    } else if (e.target.value >= 0) {
      selection_hist(e.target.value);
    }
    last_selected_hist = e.target.value;
  });
  hist_fillselect2();
  $('.js-select2_hist').val(last_selected_hist).trigger('change');
  window.scrollTo(0,0);
  document.getElementById('imagescarrousel').classList.add('d-none');
  document.getElementById('eagle_container').classList.add('d-none');
  document.getElementById('doctor').classList.add('d-none');

  document.getElementById('history').classList.remove('d-none');

  document.getElementById('tree-icon').classList.remove('d-none');
  document.getElementById('tree-icon2').classList.add('d-none');
  document.getElementById('eagle-icon').classList.remove('d-none');
  document.getElementById('eagle-icon2').classList.add('d-none');
  document.getElementById('exams-icon').classList.remove('d-none');
  document.getElementById('exams-icon2').classList.add('d-none');
  document.getElementById('hist-icon').classList.add('d-none');
  document.getElementById('hist-icon2').classList.remove('d-none');
}
document.getElementById('divt2').setAttribute("onclick", "showHistTree()");

//Render Eagle view controls
var fora = false;
var update_dots = false;
let chkSort;
let eagle_saw = null;
let eagle_saw_ids = null;

// function chkForaChange() {
//   fora = !fora;
//   update_dots = true;
//   result_eagle_dots.remove();
//   // result_eagle_dots.data({});
//   chkUpdate();
// }

function chkAllChange() {
  if (fora !== false) {
    fora = false;
    update_dots = true;
    result_eagle_dots.remove();
    chkUpdate();
  }
}

function chkForaChange() {
  if (fora !== true) {
    fora = true;
    update_dots = true;
    result_eagle_dots.remove();
    chkUpdate();
  }
}

function chkSortChange() {
  update_dots = false;
  console.log("update_dots is false now");
  chkUpdate();
}

function chkUpdate() {
  // console.log("original_EagleData");
  // console.log(original_EagleData);
  var temp_Original_EagleData = JSON.parse(JSON.stringify(original_EagleData));
  let exam = chkSort.property("checked")
    ? temp_Original_EagleData.sort((a, b) =>
        d3.descending(Math.abs(a.val_norm), Math.abs(b.val_norm))
      )
    : temp_Original_EagleData.sort((a, b) => d3.ascending(a.id_valor, b.id_valor));

  if (fora === true) {
      exam = temp_Original_EagleData.filter(d => !d.in_range);
      // eagle_saw = null;
      // eagle_saw_ids = null;
      // document.getElementById('current_eagle_search').value = "";
  }

  //new order_y must be calculated depending on number of elements and sorting
  //basically: new order_y is the resuld of these sort operations and therefore is the order of exam
  var new_exam = [];
  for (var i = 0; i < original_EagleData.length; i++) {
    for (var j = 0; j < exam.length; j++) {
      if (exam[j].id_valor === original_EagleData[i].id_valor) {
        var new_element = JSON.parse(JSON.stringify(original_EagleData[i]));
        new_element.order_y = j;
        if (eagle_saw !== null && eagle_saw_ids.indexOf(parseInt(new_element.id_valor)) > -1) {
          new_element.found_s = true;
        } else {
          new_element.found_s = false;
        }
        new_exam.push(new_element);
      }
    }
  }
  //new exam now holds the old elements with a new order_y if they are sorted.
  //in case of filtered elements, another operation must be done. order_y needs first to be scaled to the new elements
  current_EagleData = new_exam;
  // console.log("new_exam");
  // console.log(new_exam);
  update_eagle_svg2(new_exam);
}


function update_eagle_svg(exam) {
  left_hanging_labels.remove();
      // left-hanging vert axis labels (exam names)
      left_hanging_labels = svg2
        .selectAll("axis-text")
        .data(exam)
        .enter()
        .append("text")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .attr("font-size", 10)
        .attr("x", d => ramp_x(min_x_avg)-3)
        .attr("y", (d, i) => ramp_y(d.order_y))
        .style("fill", d => d.text_color)
        .text(d => d.exam_name);

  result_eagle_dots.remove();
  result_eagle_dots = svg2
    .selectAll("dots")
    .data(exam)
    .enter()
    .append("circle")
    //.classed("dots", true)
    .style("fill", d => d.dot_color)
    .attr("r", 3.25)
    .attr("cx", d => ramp_x(d.val_norm))
    // .attr("cy", (d, i) => ramp_y(i))
    .attr("cy", (d, i) => ramp_y(d.order_y))
    //.on("mouseover", tt_show(d))
    .on("mouseover", function(d) {
      tt_div
        .transition()
        .duration(500)
        .style("opacity", 0.8);
      tt_div
        .text(d.tooltip)
        .style("color", d.text_color)
        .style("left", d3.event.pageX - 48 + "px")
        .style("top", d3.event.pageY - 20 + "px");
    })
    .on("mouseout", function(d) {
      tt_div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
}

function update_eagle_svg2(exam) {
  var ext_x = d3.extent(exam, d => d.val_norm);
  min_x = Math.round(ext_x[0]) - 0.5; // negative
  max_x = Math.round(ext_x[1]) + 0.5;
  min_x_avg = min_x + 0.5;

  var  svg_pad = 10;

  // ramp_x = d3
    // .scaleLinear()
    // .domain([min_x, max_x])
    // .range([svg_pad, svg_w - svg_pad]);
  // var ramp_x_min = -5 < min_x ? -5 : min_x;
  // var ramp_x_max = 5 > max_x ? 5 : max_x;

    // ramp_x = d3
      // .scaleLinear()
      // .domain([min_x, max_x])
      // .domain([ramp_x_min, ramp_x_max])
      // .range([svg_pad, svg_w - svg_pad]);

  // ramp_y = d3
  //   .scaleLinear()
  //   .domain([0, eagle_data.length - 1])
  //   .range([svg_pad, svg_h - svg_pad]);
  function move_labels(selection) {
    selection.transition()
    .duration(1000)
    // .attr("x", d => ramp_x(min_x_avg)-3)
    .attr("y", (d, i) => ramp_y(d.order_y))
    .style("fill", d => d.text_color)
    .text(d => d.exam_name)
    ;
  }

  if (update_dots === false) {
    console.log("not updating");

    function move_dots(selection) {
      selection.transition()
              .duration(1000)
              .attr("cy", (d) => ramp_y(d.order_y))
    };



    left_hanging_labels.data(exam);

    left_hanging_labels
      .call(move_labels, 1000);


    result_eagle_dots.data(exam);
    result_eagle_dots
      .call(move_dots);

  } else {
    svg2.select("#greenzone").remove();

    var new_green = svg2
              .insert("rect",":first-child")
              .attr("id", "greenzone")
              .attr("fill", "#d0ffd0")
              .attr("x", ramp_x(-1))
              .attr("y", ramp_y(0))
              .attr("width", ramp_x(1) - ramp_x(-1))
              .attr("height", ramp_y(exam.length - 1) - ramp_y(0));

    vertical_eagle_lines.remove();
      // grid horiz
      vertical_eagle_lines = svg2
        .selectAll("line-horiz")
        .data(exam)
        .enter()
        .append("line")
        .attr("class", "horiz")
        .style("stroke", "lightgray")
        .style("stroke-width", "1px")
        // .attr("x1", d => ramp_x(min_x_avg))
        .attr("x1", d => ramp_x(min_x_avg - 1))
        .attr("y1", (d, i) => ramp_y(i))
        // .attr("x2", d => ramp_x(max_x))
        .attr("x2", d => ramp_x(max_x + 1))
        .attr("y2", (d, i) => ramp_y(i));

      // vertical_eagle_lines = svg2
      //   .selectAll("line-horiz")
      //   .data(exam)
      //   .enter()
      //   .append("line")
      //   .attr("class", "horiz")
      //   .style("stroke", "lightgray")
      //   .style("stroke-width", "1px")
      //   .attr("x1", d => ramp_x(min_x_avg))
      //   .attr("y1", (d, i) => ramp_y(i))
      //   .attr("x2", d => ramp_x(max_x))
      //   .attr("y2", (d, i) => ramp_y(i));

      // grid vert
    horizontal_eagle_lines.remove();
      // horizontal_eagle_lines = svg2
      //   .selectAll("line-vert")
      //   .data(d3.range(min_x_avg, max_x + 0.01, 0.5).filter(d => d !== 0))
      //   .enter()
      //   .append("line")
      //   // .classed("line-horiz", true)
      //   .attr("class", "horiz")
      //   .style("stroke", "lightgray")
      //   .style("stroke-width", "1px")
      //   .attr("x1", d => ramp_x(d))
      //   .attr("y1", d => ramp_y(0))
      //   .attr("x2", d => ramp_x(d))
      //   .attr("y2", d => ramp_y(exam.length - 1));

    horizontal_eagle_lines = svg2
      .selectAll("line-vert")
      // .data(d3.range(min_x_avg, max_x + 0.01, 0.5).filter(d => d !== 0))
      .data(d3.range(min_x_avg - 1, max_x + 1.01, 0.5).filter(d => d !== 0))
      .enter()
      .append("line")
      // .classed("line-horiz", true)
      .attr("class", "horiz")
      .style("stroke", "lightgray")
      .style("stroke-width", "1px")
      .attr("x1", d => ramp_x(d))
      .attr("y1", d => ramp_y(0))
      .attr("x2", d => ramp_x(d))
      .attr("y2", d => ramp_y(exam.length - 1));

  vertical_middle_line.remove();
      // vertical middle line
      vertical_middle_line = svg2
        .append("line")
        .style("stroke-dasharray", "3,3")
        .style("stroke-width", "1px")
        .style("stroke", "gray")
        .attr("x1", d => ramp_x(0))
        .attr("y1", d => ramp_y(0))
        .attr("x2", d => ramp_x(0))
        .attr("y2", d => ramp_y(exam.length - 1));

  left_hanging_labels.remove();
      // left-hanging vert axis labels (exam names)
  // left_hanging_labels = svg2
  //   .selectAll("axis-text")
  //   .data(exam)
  //   .enter()
  //   .append("text")
  //   .attr("text-anchor", "end")
  //   .attr("alignment-baseline", "middle")
  //   .attr("font-size", 10)
  //   .attr("x", d => ramp_x(min_x_avg)-3)
  //   .attr("y", (d, i) => ramp_y(d.order_y))
  //   .style("fill", d => d.text_color)
  //   .text(d => d.exam_name);
  left_hanging_labels = svg2
    .selectAll("axis-text")
    .data(exam)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 10)
    // .attr("x", d => ramp_x(min_x_avg)-3)
    .attr("x", d => ramp_x(min_x_avg - 1.1))
    .attr("y", (d, i) => ramp_y(i))
    .style("fill", d => d.text_color)
    .text(d => d.exam_name)
    .call(move_labels, 1000);

    result_eagle_dots = svg2
      .selectAll("dots")
      .data(exam)
      .enter()
      .append("circle")
      //.classed("dots", true)
      .style("fill", d => d.dot_color)
      .attr("r", 3.25)
      .attr("cx", d => ramp_x(d.val_norm))
      // .attr("cy", (d, i) => ramp_y(i))
      .attr("cy", (d, i) => ramp_y(d.order_y))
      //.on("mouseover", tt_show(d))
      .on("mouseover", function(d) {
        tt_div
          .transition()
          .duration(500)
          .style("opacity", 0.8);
        tt_div
          .text(d.tooltip)
          .style("color", d.text_color)
          .style("left", d3.event.pageX - 48 + "px")
          .style("top", d3.event.pageY - 20 + "px");
      })
      .on("mouseout", function(d) {
        tt_div
          .transition()
          .duration(500)
          .style("opacity", 0);
      });
  }
}

function eagle_fillselect2() {
  console.log("examDatas");
  console.log(examDatas);
  for (var i = 0; i < examDatas.length; i++) {
    var this_gobj = examDatas[i];
    var year = this_gobj.substr(0,4);
    var month = this_gobj.substr(4,2);
    var day = this_gobj.substr(6,2);
    var text_to_option = day + "/" + month + "/" + year;
    var newOption = new Option(text_to_option, i, false, false);
    $('.js-select2_eagle').append(newOption).trigger('change');
  }
  $('.select2-container').width('100%');
}

function selection_eagle(index) {
  var new_date = examDatas[index];
  var new_data = data2[new_date];
  var previous_eagle = JSON.parse(JSON.stringify(eagle_data));
  var new_eagle = [];
  for (var i = 0; i < new_data.length; i++) {
    // console.log(new_data[i]);
    var new_obj = null;
    for (var j = 0; j < previous_eagle.length; j++) {
      if (previous_eagle[j].id_valor === new_data[i].id) {
        new_obj = JSON.parse(JSON.stringify(previous_eagle[j]));
        new_obj.value = new_data[i].value;
        break;
      }
    }
    if (new_obj !== null) {
      new_eagle.push(new_obj);
      // new_obj = null;
    }
  }
  new_eagle = prepareData(new_eagle);
  // console.log("new_eagle");
  // console.log(new_eagle);
  // eagle_data = JSON.parse(JSON.stringify(new_eagle));
  original_EagleData = JSON.parse(JSON.stringify(new_eagle));
  current_EagleData = JSON.parse(JSON.stringify(new_eagle));
  draw_svg_eagle(new_eagle);
  fora = false;
  update_dots = false;
  chkUpdate();
  // update_eagle_svg(new_eagle);
}

function renderEagleControls() {
  var exames = document.getElementById('exames');
  var second_top_panel = document.getElementById('second-top-panel');
  var controls = document.getElementById('controls-div');
  controls.classList.add("controls-eagle");
  controls.classList.remove("controls-tree");
  controls.classList.remove("controls-exams");

  //controls should be cleared here
  var myNode = document.getElementById("controls-div");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }

  var search_div = document.createElement("div");
  search_div.id = "search_eagle_div";
  search_div.classList.add("search-inside");

  var search_input = document.createElement("input");
  search_input.type = "search";
  search_input.id = "search_eagle";
  if (current_eagle_search) {
    search_input.value = current_eagle_search;
  }

  var search_icon = document.createElement("i")
  search_icon.classList.add("fa");
  search_icon.classList.add("fa-search");
  search_icon.id = "search_icon_eagle";

  search_div.appendChild(search_icon);
  search_div.appendChild(search_input);
  // search_div.setAttribute("onKeyUp", "doEagleSearch(current_Data)");

  var all_tree = document.createElement("button");
  all_tree.id = "allpushbtn";
  all_tree.classList.add("but2");
  all_tree.classList.add("btn");
  all_tree.classList.add("common-buttons");
  // all_tree.setAttribute("onClick", "resetTreeExpand(original_Data)");

  var all_treespan = document.createElement("span");
  all_treespan.id = "all_tree_eagle-text";
  all_treespan.innerHTML = "Todos";
  all_treespan.classList.add("common-buttons-text");
  all_tree.appendChild(all_treespan);

  var outsideref = document.createElement("button");
  outsideref.id = "outsideref";
  outsideref.classList.add("but2");
  outsideref.classList.add("btn");
  // outsideref.setAttribute("onClick", "changeImage('outsideref')");

  var outsiderefspan = document.createElement("span");
  outsiderefspan.id = "outsideref-text";
  outsiderefspan.innerHTML = "Fora da Faixa";
  outsideref.appendChild(outsiderefspan);

  var checkbox_piramide_div = document.createElement("div");
  checkbox_piramide_div.id = "piramide_check_div";

  var checkbox_piramide = document.createElement("input");
  checkbox_piramide.id = "piramide_check";
  checkbox_piramide.type = "checkbox";

  var checkbox_label = document.createElement("label");
  checkbox_label.id = "piramide_check_label";
  checkbox_label.for = "piramide_check";
  checkbox_label.innerHTML = "Ordenar por Desvio";

  checkbox_piramide_div.appendChild(checkbox_piramide);
  checkbox_piramide_div.appendChild(checkbox_label);
  // controls.appendChild(search_div);

  var selectgroups = document.createElement("select");
  selectgroups.name = "groupings3";
  selectgroups.classList.add("js-select2_eagle");

  controls.appendChild(all_tree);
  controls.appendChild(checkbox_piramide_div);
  controls.appendChild(outsideref);
  controls.appendChild(selectgroups);

  chkSort = d3.select("#piramide_check");
  chkSort.on("change", chkSortChange);

  chkFora = d3.select("#outsideref");
  chkFora.on("click", chkForaChange);

  chkAll = d3.select("#allpushbtn");
  chkAll.on("click", chkAllChange);

  // $('#search_eagle').keyup(function() {
  //   delay3(function(){
  //     // alert('Time elapsed!');
  //     doSearchEagle(current_EagleData);
  //   }, 150 );
  // });
}

let last_selected_eagle = null
//Show Eagle view in Section and change controls
showEagle = function() {
  renderEagleControls();
  $('.js-select2_eagle').prepend('<option></option>').select2({placeholder: "Datas:"}).on('select2:select', function (e) {
    if (e.target.value >= 0) {
      selection_eagle(e.target.value);
    }
    last_selected_eagle = e.target.value;
  });
  eagle_fillselect2();
  $('.js-select2_eagle').val(last_selected_eagle).trigger('change');
  window.scrollTo(0,0);

  document.getElementById('imagescarrousel').classList.add('d-none');
  document.getElementById('eagle_container').classList.remove('d-none');
  document.getElementById('doctor').classList.add('d-none');
  document.getElementById('history').classList.add('d-none');

  document.getElementById('eagle-icon').classList.add('d-none');
  document.getElementById('eagle-icon2').classList.remove('d-none');
  document.getElementById('tree-icon').classList.remove('d-none');
  document.getElementById('tree-icon2').classList.add('d-none');
  document.getElementById('exams-icon').classList.remove('d-none');
  document.getElementById('exams-icon2').classList.add('d-none');
  document.getElementById('hist-icon').classList.remove('d-none');
  document.getElementById('hist-icon2').classList.add('d-none');
}
document.getElementById('dive2').setAttribute("onclick", "showEagle()");


//Render Exams view controls
function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = x.length;
  };
  for (i = 0; i < x.length; i++) {
      x[i].classList.add("d-none");
  }
  var imageindexp = document.getElementById("imageindexp");
  imageindexp.innerHTML = "Página " + slideIndex + " de 8";
  x[slideIndex-1].classList.remove("d-none");
}

function renderExamsControls() {
  var exames = document.getElementById('exames');
  var second_top_panel = document.getElementById('second-top-panel');
  var controls = document.getElementById('controls-div');
  controls.classList.add("controls-exams");
  controls.classList.remove("controls-tree");
  controls.classList.remove("controls-eagle");
  //controls should be cleared here
  var myNode = document.getElementById("controls-div");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }

  //buttons are created here
  var leftmvbtndiv = document.createElement("div");
  leftmvbtndiv.id = "leftmvbtn";
  var rightmvbtndiv = document.createElement("div");
  rightmvbtndiv.id = "rightmvbtn";
  var leftmvbtn = document.createElement("button");
  leftmvbtn.id = "lmvbtn";
  leftmvbtn.classList.add("w3-button");
  leftmvbtn.classList.add("w3-display-left");
  leftmvbtn.innerHTML = '&#10094;';
  leftmvbtndiv.appendChild(leftmvbtn);
  leftmvbtn.setAttribute("onClick", "plusDivs(-1)");

  var imageindexp = document.createElement("p");
  imageindexp.id = "imageindexp";
  imageindexp.classList.add("exam-sub");
  imageindexp.innerHTML = "Página " + slideIndex + " de 8";

  var rightmvbtn = document.createElement("button");
  rightmvbtn.id = "rmvbtn";
  rightmvbtn.classList.add("w3-button");
  rightmvbtn.classList.add("w3-display-left");
  rightmvbtn.innerHTML = '&#10095;';
  rightmvbtndiv.appendChild(rightmvbtn);
  rightmvbtn.setAttribute("onClick", "plusDivs(1)");
  controls.appendChild(leftmvbtndiv);
  controls.appendChild(imageindexp);
  controls.appendChild(rightmvbtndiv);
  showDivs(slideIndex);
}

//Show Exams view in Section and change controls
showExams = function() {
  renderExamsControls();
  window.scrollTo(0,0);
  document.getElementById('doctor').classList.add('d-none');
  document.getElementById('history').classList.add('d-none');
  document.getElementById('eagle_container').classList.add('d-none');
  document.getElementById('imagescarrousel').classList.remove('d-none');

  document.getElementById('exams-icon').classList.add('d-none');
  document.getElementById('exams-icon2').classList.remove('d-none');
  document.getElementById('tree-icon').classList.remove('d-none');
  document.getElementById('tree-icon2').classList.add('d-none');
  document.getElementById('eagle-icon').classList.remove('d-none');
  document.getElementById('eagle-icon2').classList.add('d-none');
  document.getElementById('hist-icon').classList.remove('d-none');
  document.getElementById('hist-icon2').classList.add('d-none');
}
document.getElementById('divex3').setAttribute("onclick", "showExams()");

function showLoadingDiv() {
  document.getElementById('loadingDiv').classList.add('d-none');
}
