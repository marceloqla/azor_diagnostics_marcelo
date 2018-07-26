var tooltip_doctor_state = false;
var tooltip_patient_state = false;

var doctor_object_tree = null;

function consoleThis() {
    console.log("i have clicked bro");
    // var tooltip_image = document.getElementById('tooltip_this');
    console.log(tooltip_doctor_state);
    console.log(tooltip_patient_state);

    // var doctor_in = !($('#doctor').hasClass('d-none'));
    // var patient_in = !($('#patient').hasClass('d-none'));
    // console.log("doctor_in");
    // console.log(doctor_in);
    // console.log("patient_in");
    // console.log(patient_in);
    // if (doctor_in) {
    //   var tooltip_left = $("#tooltip_this").css("left");
    //   console.log($("#tooltip_this").css("left"));
    //   if (tooltip_left) {
    //     document.getElementById('tooltip_this').classList.add("focus-in-tooltip-div");
    //     document.getElementById('tooltip_this').classList.remove("focus-out-tooltip-div");
    //   }
    // }
    // console.log(tooltip_image);
}

$( function() {
    var widths = [];
    $('#additionalcontrols').children().each(function(i){
      widths[i] = $(this).width();
    });
    document.getElementById('additionalcontrols').style.width = (Math.max.apply(Math, widths) + 10) + "px";
    console.log(Math.max.apply(Math, widths));
    $( "#additionalcontrols" ).draggable({
      containment: [-1000, -1000, $('body').innerWidth() + 1000, $('body').innerHeight() + 1000],
      // helper: 'clone',
      start: function(event, ui){
        $(ui.helper).css('width', `${ Math.max.apply(Math, widths) }px`);
      }
    });
} );
// dragElement(document.getElementById("additionalcontrols"));
//
// var intial_add_cont_width = $('#additionalcontrols').width();
// var stop = false;
// function dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   if (document.getElementById(elmnt.id + "header")) {
//     /* if present, the header is where you move the DIV from:*/
//     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//   } else {
//     /* otherwise, move the DIV from anywhere inside the DIV:*/
//     elmnt.onmousedown = dragMouseDown;
//   }
//
//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }
//
//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     // if (elmnt.offsetLeft - pos1 < elmnt.width) {
//       // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     // }
//     // console.log("a" + ($('body').innerWidth() - (elmnt.offsetLeft - pos1)));
//
//     var a_size = $('body').innerWidth() - (elmnt.offsetLeft - pos1);
//     var b_size = intial_add_cont_width;
//     console.log(a_size - b_size);
//     if (a_size - b_size <= 0) {
//       elmnt.style.left = $('body').innerWidth() -  intial_add_cont_width + "px";
//       // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//       // elmnt.style.left = null;
//       // elmnt.style.right = (a_size - b_size) + "px";
//       stop = true;
//     } else {
//       elmnt.style.right = null;
//       elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     }
//     document.getElementById('additionalcontrols').classList.remove('yes-right');
//   }
//
//   function closeDragElement() {
//     /* stop moving when mouse button is released:*/
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }
//
// var collaps = document.getElementsByClassName("collapsible");
// collaps[0].addEventListener("click", function() {
//   this.classList.toggle("active");
//   console.log(this.parentNode.parentNode.childNodes[3]);
//   // console.log(this.parent);
//   var content = this.parentNode.parentNode.childNodes[3];
//   if (content.style.display === "block") {
//     content.style.display = "none";
//   } else {
//     content.style.display = "block";
//   }
// });

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function showLoadingDiv() {
  document.getElementById('loadingDiv').classList.add('d-none');
}

function openPacient() {
  //hide doctor or exames
  document.getElementById('second-controls').classList.remove('controls-doctor-patient_exams');
  document.getElementById('second-controls').classList.remove('controls-doctor-patient_doctor');
  document.getElementById('second-controls').classList.add('controls-doctor-patient_patient');

  document.getElementById('seg-select-div').classList.remove("d-none");
  document.getElementById('left-controls-patient').classList.remove("d-none");
  document.getElementById('left-controls-doctor').classList.add("d-none");
  document.getElementById('right-controls-do-in').classList.add("d-none");

  var y = document.getElementsByClassName("zoomContainer");
  for (j = 0; j < y.length; j++) {
    y[j].parentNode.removeChild(y[j]);
  }

  document.getElementById('exames').classList.add("d-none");
  document.getElementById('doctor').classList.add("d-none");
  document.getElementById('patient').classList.remove("d-none");

  // document.getElementById('app').classList.remove("app-exam");
  // document.getElementById('app').classList.remove("app-doctor");
  // document.getElementById('app').classList.add("app-patient");

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById('patient-but').classList.add("active");

  //show patient
};

function openDoctor() {
  //hide panel buttons and others.
  document.getElementById('second-controls').classList.remove('controls-doctor-patient_exams');
  document.getElementById('second-controls').classList.remove('controls-doctor-patient_patient');
  document.getElementById('second-controls').classList.add('controls-doctor-patient_doctor');

  document.getElementById('seg-select-div').classList.remove("d-none");
  document.getElementById('left-controls-patient').classList.add("d-none");
  document.getElementById('left-controls-doctor').classList.remove("d-none");
  document.getElementById('right-controls-do-in').classList.remove("d-none");

  //hide patient or exames
  var y = document.getElementsByClassName("zoomContainer");
  for (j = 0; j < y.length; j++) {
    y[j].parentNode.removeChild(y[j]);
  }

  document.getElementById('exames').classList.add("d-none");
  document.getElementById('patient').classList.add("d-none");
  document.getElementById('doctor').classList.remove("d-none");

  // document.getElementById('app').classList.remove("app-exam");
  // document.getElementById('app').classList.add("app-doctor");
  // document.getElementById('app').classList.remove("app-patient");

  tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");

    }
    document.getElementById('doctor-but').classList.add("active");

  //show doctor

};

function openExames() {
  //hide panel buttons and others.
  document.getElementById('second-controls').classList.remove('controls-doctor-patient_doctor');
  document.getElementById('second-controls').classList.remove('controls-doctor-patient_patient');
  document.getElementById('second-controls').classList.add('controls-doctor-patient_exams');

  document.getElementById('seg-select-div').classList.add("d-none");
  document.getElementById('left-controls-patient').classList.add("d-none");
  document.getElementById('left-controls-doctor').classList.add("d-none");
  document.getElementById('right-controls-do-in').classList.add("d-none");

  //hide doctor or patient
  document.getElementById('doctor').classList.add("d-none");
  document.getElementById('patient').classList.add("d-none");
  document.getElementById('exames').classList.remove("d-none");
  // document.getElementById('#app').style.grid-template-rows = "1fr 8fr 0fr 0fr";

  // document.getElementById('app').classList.add("app-exam");
  // document.getElementById('app').classList.remove("app-doctor");
  // document.getElementById('app').classList.remove("app-patient");

  tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById('exames-but').classList.add("active");
  showDivs(slideIndex);
  //show exames carrouseul
};


/*jshint esversion: 6 */
(function () {
    'use strict';
}());

// var oldData = Object.create(data);
var oldData = JSON.parse(JSON.stringify(data));


var data_image_links = [];

function renderTreeWhole(data_new, reload_this) {
  document.getElementById('loadingDiv').classList.remove('d-none');
  //helper function for object filtering
  function filter_function(array, path) {
    var result = [];
    array.forEach(function (a) {
        var temp = [],
            o = {},
            found = false;

        if (path.indexOf(a.name_to_print) !== -1) {
            // console.log(a.name_to_print);
            o.name_to_print = a.name_to_print;
            if (a.id_valor) {
              o.id_valor = a.id_valor;
              o.id_metodo = a.id_metodo;
              o.metodo = a.metodo;
            }
            found = true;
            // console.log(o);
        }
        if (Array.isArray(a.children)) {
            temp = filter_function(a.children, path);
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
  //helper functions check colors for a child node
  var childColor = function(d) {
    var properties = data2;
    for(k in properties) {
      if(properties[k].id_valor == d.id_valor) {
        var verification = properties[k].valid;
        if (verification === false) {
            return "red_c";
          } else if (verification === null) {
            return "yellow_c";
          } else if (verification === true) {
            return "green_c";
          }
        }
      }
  };
  //helper functions check colors for a parent node
  var parentColor = function(obj) {
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
  var combined = [];
  var combinePaths = function(obj, list_objs_names) {
    if (obj.children) {
      obj.children.forEach(function (c) {
          if (c.children) {
            combinePaths(c, list_objs_names);
          } else {
            if (list_objs_names.indexOf(c.name_to_print) > -1) {
              if (combined.indexOf(obj.name_to_print) === -1) {
                combined.push(obj.name_to_print);
              }
            }
          }
      });
    } else {
      if (list_objs_names.indexOf(obj.name_to_print) > -1) {
        // console.log("obj in list!");
        // console.log(obj.name_to_print);
        if (combined.indexOf(obj.name_to_print) === -1) {
          combined.push(obj.name_to_print);
        }
      }
    }
    // return combined;
  };

  var list_expandible = [];
  var list_expandible2 = [];

  if (data_new) {
    data2 = data_new;
    data = oldData;
  }

  var tree = d3.tree;
  var hierarchy = d3.hierarchy;
  var select = d3.select;

  var div_tool = d3.select("body").append("div")
    .attr("id", "tooltip_this")
    .attr("class", "tooltip_a focus-out-tooltip-div")
    // .style("opacity", 0)
    // .style("pointer-events", "none")
    ;
  var div_tool2 = d3.select("body").append("div")
      .attr("id", "tooltip_this2")
      // .attr("class", "tooltip_a")
      .attr("class", "tooltip_a focus-out-tooltip-div")
      // .style("opacity", 0)
      // .style("pointer-events", "none")
      ;
  var last_focus = false;

  var DoctorTree = /** @class */ (function () {
      function DoctorTree() {
          var _this = this;
          this.connector = function (d) {
              //straight
              return "M" + d.parent.y + "," + d.parent.x
                  + "V" + d.x + "H" + d.y;
          };
          this.collapse = function (d) {
              if (d.children) {
                  d._children = d.children;
                  d._children.forEach(_this.collapse);
                  d.children = null;
              }
          };
          this.collapseLevel = function (d) {
            if (d.children && d.depth > 1) {
              d._children = d.children;
              d._children.forEach(_this.collapseLevel);
              d.children = null;
            } else if (d.children) {
              d.children.forEach(_this.collapseLevel);
            }
          };
          this.collapseSpecific = function (d) {
            if (d.children && list_expandible.indexOf(d.data.name_to_print) === -1) {
              d._children = d.children;
              d._children.forEach(_this.collapseSpecific);
              d.children = null;
            } else if (d.children) {
              d.children.forEach(_this.collapseSpecific);
            }
          };
          //here specific collapse functions should be written
          this.expand = function (d) {
            // console.log("Expanding...");
            var children = (d.children)?d.children:d._children;
            if (d._children) {
              d.children = d._children;
              d._children = null;
            }
            if(children) {
              children.forEach(_this.expand);
            }
          };
          //list_expandible should be match nodes and their parents
          this.expandSpecific = function (d) {
            var children = (d.children)?d.children:d._children;
            if (d._children) {
              d.children = d._children;
              d._children = null;
            }
            if(children) {
              children.filter(function(d) { return list_expandible.indexOf(d.data.name_to_print) > -1; })
                    .forEach(_this.expandSpecific);
            }

          };
          this.click = function (d) {
              if (d.children) {
                  d._children = d.children;
                  d.children = null;
              }
              else {
                  d.children = d._children;
                  d._children = null;
              }
              _this.update(d);
              // _this.color();
          };

          this.update = function (source) {
              _this.width = 800;
              // Compute the new tree layout.
              var nodes = _this.tree(_this.root);
              var nodesSort = [];
              nodes.eachBefore(function (n) {
                  nodesSort.push(n);
              });
              _this.height = Math.max(500, nodesSort.length * _this.barHeight + _this.margin.top + _this.margin.bottom) + 500;
              var links = nodesSort.slice(1);
              // Compute the "layout".
              nodesSort.forEach(function (n, i) {
                  n.x = i * _this.barHeight;
              });
              // d3.select('svg').transition()
              d3.select('#doctor-svg').transition()
                  .duration(_this.duration)
                  .attr("height", _this.height);
              // Update the nodes…
              var node = _this.svg.selectAll('g.node')
                  .data(nodesSort, function (d) {
                  return d.id || (d.id = ++this.i);
              });
              // Enter any new nodes at the parent's previous position.
              var nodeEnter = node.enter().append('g')
                  .attr('class', 'node')
                  .attr('transform', function () {
                  return 'translate(' + source.y0 + ',' + source.x0 + ')';
              })
                  .on('click', _this.click)
                  ;

              nodeEnter.append('circle')
                  .attr('r', 1e-6)
                  .attr("class", function(d) {
                    if (d.data.id_valor) { //se no folha
                      //RECENT EDIT
                      // console.log(childColor(d.data) + " tooltip");
                      var final_class = childColor(d.data);// + " tooltip";
                      // console.log(final_class);
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
                      console.log("clicked");
                      var img_link = data_image_links[d.data.id_valor - 1].ref_png;
                      div_tool.classed("focus-out-tooltip-div", false)
                        // .transition()
                        // .duration(200)
                        // .style("opacity", .9);
                        // .style("opacity", 1)
                        // .style("pointer-events", "auto")

                        .classed("focus-in-tooltip-div", true)
                        ;
                      // console.log(d3.event);
                      console.log(this.parentNode.getBoundingClientRect());
                      var parent_x_pos = this.parentNode.getBoundingClientRect().left + (this.parentNode.getBoundingClientRect().width / 1.5);
                      parent_x_pos = parent_x_pos +  $(window).scrollLeft();
                      var parent_y_pos = this.parentNode.getBoundingClientRect().top +  this.parentNode.getBoundingClientRect().height;
                      parent_y_pos = parent_y_pos +  $(window).scrollTop();
                      // console.log(parent_x_pos);
                      // console.log(parent_y_pos);
                      div_tool.html("<img class='image-tool' onload='showLoadingDiv()' src='" + img_link + "' alt=''>")
                        // .style("left", (d3.event.pageX) + "px")
                        .style("left", (parent_x_pos) + "px")
                        // .style("top", (d3.event.pageY - 28) + "px");
                        .style("top", (parent_y_pos) + "px");
                      last_focus = true;
                    }
                  })
                  .on('focusout', function(d) {
                    if (!d.children) {
                      console.log("focusout!");
                      div_tool.classed("focus-out-tooltip-div", true)
                      // .transition()
                      // .duration(500)

                      .classed("focus-in-tooltip-div", false)
                      // .style("opacity", 0)
                      // .style("pointer-events", "none")
                      ;
                    }
                  })
                  ;
              /*.style('fill', function (d: any) {
              return d._children ? 'lightsteelblue' : '#fff';
            })*/
              nodeEnter.append('text')
                  .attr('x', function (d) {
                  return d.children || d._children ? 10 : 10;
              })
                  .attr('dy', '.35em')
                  .attr('text-anchor', function (d) {
                  return d.children || d._children ? 'start' : 'start';
              })
                  .text(function (d) {
                  /*if (d.data.name_to_print.length > 20) {
                    return d.data.name_to_print.substring(0, 20) + '...';
                  } else {
                    return d.data.name_to_print;
                  } */

                  //split and operate here on name for styling

                  // return d.data.name_to_print;
                  if (d.data.children)  {
                    // console.log(d.data);
                    // console.log(d.data.name);
                    // console.log(d.data.name_to_print);
                    if (!d.data.name_to_print) {
                      return "undefined";
                    }
                    var all_but_last = d.data.name_to_print.split(" (").slice(0, -1).join('');
                    return all_but_last + " (";
                  } else {
                    return d.data.name_to_print;
                  }
              })
                  .style('fill-opacity', 1e-6)//;
                  .append("tspan")
                  .style("fill", function(d) {
                    if (d.data.children)  {
                      if (!d.data.name_to_print) {
                        return "black";
                      }
                      var number_array1 = d.data.name_to_print.split(" (")[d.data.name_to_print.split(" (").length - 1].split("/")[0];
                      if (parseInt(number_array1) > 0) {
                        return "red";
                      }
                    }
                    return "black";
                  })
                  .text(function (d) {
                    if (d.data.children)  {
                      if (!d.data.name_to_print) {
                        return "undefined";
                      }
                      var number_array1 = d.data.name_to_print.split(" (")[d.data.name_to_print.split(" (").length - 1].split("/")[0];
                      if (parseInt(number_array1) === 0) {
                        return "";
                      }
                      return number_array1;
                    } else {
                      return "";
                    }
              })
                  .append("tspan")
                  .style("fill", "black")
                  .text(function (d) {
                    if (d.data.children)  {
                      if (!d.data.name_to_print) {
                        return "undefined";
                      }
                      var number_array = d.data.name_to_print.split(" (")[d.data.name_to_print.split(" (").length - 1].split("/")[1];
                      var number_array2 = d.data.name_to_print.split(" (")[d.data.name_to_print.split(" (").length - 1].split("/")[0];
                      if (parseInt(number_array2) === 0) {
                        return number_array;
                      }
                      return "/" + number_array;
                    } else {
                      return "";
                    }
              })
              nodeEnter.append('svg:title').text(function (d) {
                //DO HERE
                  if (d.data.children)  {
                    return d.data.name_to_print;
                  } else {
                    for (var i = 0; i < data2.length; i++) {
                      if (data2[i].id_valor) {
                        if (data2[i].id_valor === d.data.id_valor) {
                          if (data2[i].min !== null) {
                          // if (data2[i].valid !== null) {
                            return "Ref: " + data2[i].min + " a " + data2[i].max + ".\r\nMétodo: " + d.data.metodo;
                          } else {
                            return "Ref: Sem referência.\r\nMétodo: " + d.data.metodo;
                          }
                        }
                      }
                    }
                  }
              });
              // Transition nodes to their new position.
              var nodeUpdate = node.merge(nodeEnter)
                  .transition()
                  .duration(_this.duration);
              nodeUpdate
                  .attr('transform', function (d) {
                  return 'translate(' + d.y + ',' + d.x + ')';
              });
              nodeUpdate.select('circle')
                  .attr('r', 4.5)
                  // .attr("class", "fill");
                  .attr("class", function(d) {
                    if (d.data.id_valor) { //se no folha
                      //RECENT EDIT
                      var final_class = childColor(d.data); // + " tooltip";
                      // return childColor(d.data);
                      return final_class;
                    } else { //se no pai, checar validez dos nos filhos.
                      var new_color = "fill";
                      return new_color;
                    }
                  });

              nodeUpdate.select('text')
                  .style('fill-opacity', 1);
              // Transition exiting nodes to the parent's new position (and remove the nodes)
              var nodeExit = node.exit().transition()
                  .duration(_this.duration);
              nodeExit
                  .attr('transform', function (d) {
                  return 'translate(' + source.y + ',' + source.x + ')';
              })
                  .remove();
              nodeExit.select('circle')
                  .attr('r', 1e-6);
              nodeExit.select('text')
                  .style('fill-opacity', 1e-6);
              // Update the links…
              var link = _this.svg.selectAll('path.link')
                  .data(links, function (d) {
                  // return d.target.id;
                  var id = d.id + '->' + d.parent.id;
                  return id;
              });
              // Enter any new links at the parent's previous position.
              var linkEnter = link.enter().insert('path', 'g')
                  .attr('class', 'link')
                  .attr('d', function (d) {
                  var o = { x: source.x0, y: source.y0, parent: { x: source.x0, y: source.y0 } };
                  return _this.connector(o);
              });
              // Transition links to their new position.
              link.merge(linkEnter).transition()
                  .duration(_this.duration)
                  .attr('d', _this.connector);
              // // Transition exiting nodes to the parent's new position.
              link.exit().transition()
                  .duration(_this.duration)
                  .attr('d', function (d) {
                  var o = { x: source.x, y: source.y, parent: { x: source.x, y: source.y } };
                  return _this.connector(o);
              })
                  .remove();
              // Stash the old positions for transition.
              nodesSort.forEach(function (d) {
                  d.x0 = d.x;
                  d.y0 = d.y;
              });

              // _this.color();
          };
      }

      DoctorTree.prototype.$onExpand = function () {
        console.log("Expand!!!");
        var _this = this;
        // console.log(this.root);
        // console.log(this.expand);
        // this.update(this.root);
        this.expand(this.root);
        // this.collapse(this.root);
      }

      DoctorTree.prototype.$onUpdate = function (newdata) {
        console.log("Updated!!!");
        var _this = this;
        this.root = this.tree(hierarchy(newdata));
        this.root.each(function (d) {
            d.name_to_print = d.id; //transferring name to a name variable
            d.id = _this.i; //Assigning numerical Ids
            _this.i++;
        });
        this.root.x0 = this.root.x;
        this.root.y0 = this.root.y;
        this.update(this.root);
      }

      DoctorTree.prototype.$onInit = function (newdata, collapsebool, expandsearch, expandall) {
          console.log("Initializing...");
          var _this = this;
          this.margin = { top: 20, right: 10, bottom: 20, left: 10 };
          var do_width = $('#patient-tree').width() > 0 ? $('#patient-tree').width() : $('#doctor-tree').width();
          var do_height = $('body').height();
          this.width = do_width - this.margin.right - this.margin.left;
          this.height = 2800 - this.margin.top - this.margin.bottom;
          var def = 15;
          if (viewport().width > 1900) {
            def = 26;
          }
          if (viewport().width > 2000) {
            def = 20;
          }
          if (viewport().width > 2250) {
            def = 35;
          }
          if (viewport().width > 2500) {
            def = 40;
          }
          if (viewport().width > 2750) {
            def = 50;
          }
          if (viewport().width > 3000) {
            def = 55;
          }
          if (viewport().width > 3800) {
            def = 60;
          }
          if (viewport().width > 4000) {
            def = 65;
          }
          console.log(def);
          this.barHeight = def;
          // this.barHeight = 30;
          // this.barHeight = viewHeight;

          this.barWidth = this.width * .8;
          this.i = 0;
          this.duration = 750;
          this.tree = tree().size([this.width, this.height]);
          this.tree = tree().nodeSize([0, 30]);
          //here data should also be passed by the on init function optionally
          var used_data = newdata || data;
          this.root = this.tree(hierarchy(used_data));
          this.root.each(function (d) {
              d.name_to_print = d.id; //transferring name to a name variable
              d.id = _this.i; //Assigning numerical Ids
              _this.i++;
          });
          this.root.x0 = this.root.x;
          this.root.y0 = this.root.y;
          //svg should always be reset on init
          var myNode = document.getElementById('doctor-svg');
          if (myNode) {
            myNode.parentNode.removeChild(myNode);
          }
          this.svg = select('#doctor-tree').append('svg')
              .attr("id", "doctor-svg")
              .attr('width', this.width + this.margin.right + this.margin.left)
              .attr('height', this.height + this.margin.top + this.margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

          // this.tip = d3.tip()
          //   .attr('class', 'd3-tip')
          //   .offset([-10, 0])
          //   .html(function(d) {
          //     return "<strong>Frequency:</strong> <span style='color:red'>" + "TESTANDO123" + "</span>";
          //   });
          // this.svg.call(this.tip);
          if (collapsebool === false) {
            //expands whole tree
            if (expandall !== true)  {
              if (expandsearch !== true) {
                // this.expand(this.root);
                this.collapse(this.root);
              } else {
                this.root.children.forEach(this.collapseSpecific);
              }
            } else {
              console.log("Expanded");
              this.expand(this.root);
            }
          } else {
            // only shows first-level children!
              console.log("First Level shown");
            this.root.children.forEach(this.collapseLevel);
          }
          this.update(this.root);
      };
      return DoctorTree;
  }());
  ;

  var PatientTree = /** @class */ (function () {
      function PatientTree() {
          var _this = this;
          this.connector = function (d) {
              //straight
              return "M" + d.parent.y + "," + d.parent.x
                  + "V" + d.x + "H" + d.y;
          };
          this.collapse = function (d) {
              if (d.children) {
                  d._children = d.children;
                  d._children.forEach(_this.collapse);
                  d.children = null;
              }
          };
          this.collapseLevel = function (d) {
            if (d.children && d.depth > 1) {
              d._children = d.children;
              d._children.forEach(_this.collapseLevel);
              d.children = null;
            } else if (d.children) {
              d.children.forEach(_this.collapseLevel);
            }
          }
          this.collapseSpecific = function (d) {
            if (d.children && list_expandible2.indexOf(d.data.name_to_print) === -1) {
              d._children = d.children;
              d._children.forEach(_this.collapseSpecific);
              d.children = null;
            } else if (d.children) {
              d.children.forEach(_this.collapseSpecific);
            }
          };
          //here specific collapse functions should be written
          this.expand = function (d) {
            console.log("Expanding...");
            var children = (d.children)?d.children:d._children;
            if (d._children) {
              d.children = d._children;
              d._children = null;
            }
            if(children) {
              children.forEach(_this.expand);
            }
          };

          //list_expandible should be match nodes and their parents
          this.expandSpecific = function (d) {
            var children = (d.children)?d.children:d._children;
            if (d._children) {
              d.children = d._children;
              d._children = null;
            }
            if(children) {
              children.filter(function(d) { return list_expandible2.indexOf(d.data.name_to_print) > -1; })
                    .forEach(_this.expandSpecific);
            }

          };

          this.click = function (d) {
              if (d.children) {
                  d._children = d.children;
                  d.children = null;
              }
              else {
                  d.children = d._children;
                  d._children = null;
              }
              _this.update(d);
              // _this.color();
          };

          // .on('click', function(d) {
            // if (!d.children && data_image_links[d.data.id_valor - 1]) {
              // d3.select('#refimage').attr("src", data_image_links[d.data.id_valor - 1].ref_png);
            // }
          // })

          this.update = function (source) {
              _this.width = 800;
              // Compute the new tree layout.
              var nodes = _this.tree(_this.root);
              var nodesSort = [];
              nodes.eachBefore(function (n) {
                  nodesSort.push(n);
              });
              _this.height = Math.max(500, nodesSort.length * _this.barHeight + _this.margin.top + _this.margin.bottom) + 500;
              var links = nodesSort.slice(1);
              // Compute the "layout".
              nodesSort.forEach(function (n, i) {
                  n.x = i * _this.barHeight;
              });
              d3.select('#patient-svg').transition()
              // d3.select('svg').transition()
                  .duration(_this.duration)
                  .attr("height", _this.height);
              // Update the nodes…
              var node = _this.svg.selectAll('g.node')
                  .data(nodesSort, function (d) {
                  return d.id || (d.id = ++this.i);
              });
              // Enter any new nodes at the parent's previous position.
              var nodeEnter = node.enter().append('g')
                  .attr('class', 'node')
                  .attr('transform', function () {
                  return 'translate(' + source.y0 + ',' + source.x0 + ')';
              })
                  .on('click', _this.click);
              nodeEnter.append('circle')
                  .attr('r', 1e-6)
                  .attr("class", function(d) {
                    if (d.data.id_valor) { //se no folha
                      // return childColor(d.data);
                      var new_color = "fill";
                      return new_color;

                    } else { //se no pai, checar validez dos nos filhos.
                      var new_color = "fill";
                      return new_color;
                    }
                  })
                  .style("cursor", "pointer")
                  // .on('click', function(d) {
                  //   if (!d.children && data_image_links[d.data.id_valor - 1]) {
                  //     d3.select('#refimage').attr("src", data_image_links[d.data.id_valor - 1].ref_png);
                  //   }
                  // })

                  .on('click', function(d){
                    if (!d.children && data_image_links[d.data.id_valor - 1]) {
                      //on click replace titles
                      // document.getElementById("title").outerHTML = document.getElementById("93").outerHTML.replace(/wns/g,"lmn");

                      document.getElementById('loadingDiv').classList.remove('d-none');
                      console.log("clicked");
                      var img_link = data_image_links[d.data.id_valor - 1].ref_png;
                      div_tool2.classed("focus-out-tooltip-div", false)
                          // .transition()
                          // .duration(200)
                          // .style("opacity", .9);
                          // .style("opacity", 1)
                          // .style("pointer-events", "auto")

                          .classed("focus-in-tooltip-div", true)
                          ;

                        console.log(this.parentNode.getBoundingClientRect());
                        var parent_x_pos2 = this.parentNode.getBoundingClientRect().left + (this.parentNode.getBoundingClientRect().width / 1.5);
                        parent_x_pos2 = parent_x_pos2 +  $(window).scrollLeft();
                        var parent_y_pos2 = this.parentNode.getBoundingClientRect().top +  this.parentNode.getBoundingClientRect().height;
                        parent_y_pos2 = parent_y_pos2 +  $(window).scrollTop();
                        // console.log(parent_x_pos);
                        // console.log(parent_y_pos);
                      div_tool2.html("<img class='image-tool' onload='showLoadingDiv()' src='" + img_link + "' alt=''>")
                        // .style("left", (d3.event.pageX) + "px")
                        .style("left", (parent_x_pos2) + "px")
                        // .style("top", (d3.event.pageY - 28) + "px");
                        .style("top", (parent_y_pos2) + "px");

                      // div_tool2.html("<img class='image-tool' onload='showLoadingDiv()' src='" + img_link + "' alt=''>")
                        // .style("left", (d3.event.pageX) + "px")
                        // .style("top", (d3.event.pageY - 28) + "px");
                      last_focus = true;
                    }
                  })
                  .on('focusout', function(d) {
                    if (!d.children) {
                      console.log("focusout!");
                      div_tool2.classed("focus-out-tooltip-div", true)
                          // .transition()
                          // .duration(200)
                          // .style("opacity", .9);
                          // .style("opacity", 1)
                          // .style("pointer-events", "auto")
                          .classed("focus-in-tooltip-div", false)

                      // .transition()
                      // .duration(500)
                      // .style("opacity", 0)
                      // .style("pointer-events", "none")
                      ;
                    }
                  })
                  ;
                  ;
              /*.style('fill', function (d: any) {
              return d._children ? 'lightsteelblue' : '#fff';
            })*/
              nodeEnter.append('text')
                  .attr('x', function (d) {
                  return d.children || d._children ? 10 : 10;
              })
                  .attr('dy', '.35em')
                  .attr('text-anchor', function (d) {
                  return d.children || d._children ? 'start' : 'start';
              })
                  .text(function (d) {
                  /*if (d.data.name_to_print.length > 20) {
                    return d.data.name_to_print.substring(0, 20) + '...';
                  } else {
                    return d.data.name_to_print;
                  } */

                  //split and operate here on name for styling

                  if (d.data.children)  {
                    // var all_but_last = d.data.name_to_print.split(" (").slice(0, -1).join('');
                    // return all_but_last + " (";
                    return d.data.name_to_print.split(" (")[0] + ' (' + d.data.name_to_print.split(" (")[1].split('/')[1];
                  } else {
                    return d.data.name_to_print;
                  }
              })
              nodeEnter.append('svg:title').text(function (d) {
                //DO HERE
                  if (d.data.children)  {
                    return d.data.name_to_print;
                  } else {
                    for (var i = 0; i < data2.length; i++) {
                      if (data2[i].id_valor) {
                        if (data2[i].id_valor === d.data.id_valor) {
                          if (data2[i].min !== null) {
                            return "Ref: " + data2[i].min + " a " + data2[i].max + ".\r\nMétodo: " + d.data.metodo;
                          } else {
                            return "Ref: Sem referência.\r\nMétodo: " + d.data.metodo;
                          }
                        }
                      }
                    }
                  }
              });
              // Transition nodes to their new position.
              var nodeUpdate = node.merge(nodeEnter)
                  .transition()
                  .duration(_this.duration);
              nodeUpdate
                  .attr('transform', function (d) {
                  return 'translate(' + d.y + ',' + d.x + ')';
              });
              nodeUpdate.select('circle')
                  .attr('r', 4.5)
                  // .attr("class", "fill");
                  .attr("class", function(d) {
                    if (d.data.id_valor) { //se no folha
                      // return childColor(d.data);
                      var new_color = "fill";
                      return new_color;

                    } else { //se no pai, checar validez dos nos filhos.
                      var new_color = "fill";
                      return new_color;
                    }
                  })
                  ;

              nodeUpdate.select('text')
                  .style('fill-opacity', 1);
              // Transition exiting nodes to the parent's new position (and remove the nodes)
              var nodeExit = node.exit().transition()
                  .duration(_this.duration);
              nodeExit
                  .attr('transform', function (d) {
                  return 'translate(' + source.y + ',' + source.x + ')';
              })
                  .remove();
              nodeExit.select('circle')
                  .attr('r', 1e-6);
              nodeExit.select('text')
                  .style('fill-opacity', 1e-6);
              // Update the links…
              var link = _this.svg.selectAll('path.link')
                  .data(links, function (d) {
                  // return d.target.id;
                  var id = d.id + '->' + d.parent.id;
                  return id;
              });
              // Enter any new links at the parent's previous position.
              var linkEnter = link.enter().insert('path', 'g')
                  .attr('class', 'link')
                  .attr('d', function (d) {
                  var o = { x: source.x0, y: source.y0, parent: { x: source.x0, y: source.y0 } };
                  return _this.connector(o);
              });
              // Transition links to their new position.
              link.merge(linkEnter).transition()
                  .duration(_this.duration)
                  .attr('d', _this.connector);
              // // Transition exiting nodes to the parent's new position.
              link.exit().transition()
                  .duration(_this.duration)
                  .attr('d', function (d) {
                  var o = { x: source.x, y: source.y, parent: { x: source.x, y: source.y } };
                  return _this.connector(o);
              })
                  .remove();
              // Stash the old positions for transition.
              nodesSort.forEach(function (d) {
                  d.x0 = d.x;
                  d.y0 = d.y;
              });

              // _this.color();
          };
      }
      PatientTree.prototype.$onInit = function (newdata, collapsebool, expandsearch, expandall) {
          var _this = this;
          this.margin = { top: 20, right: 10, bottom: 20, left: 10 };
          // console.log($('#patient-tree').width());
          var do_width = $('#patient-tree').width() > 0 ? $('#patient-tree').width() : $('#doctor-tree').width();
          this.width = do_width - this.margin.right - this.margin.left;
          this.height = 2800 - this.margin.top - this.margin.bottom;
          // this.barHeight = 20;
          var def = 15;
          if (viewport().width > 1900) {
            def = 26;
          }
          if (viewport().width > 2000) {
            def = 20;
          }
          if (viewport().width > 2250) {
            def = 35;
          }
          if (viewport().width > 2500) {
            def = 40;
          }
          if (viewport().width > 2750) {
            def = 50;
          }
          if (viewport().width > 3000) {
            def = 55;
          }
          if (viewport().width > 3800) {
            def = 60;
          }
          if (viewport().width > 4000) {
            def = 65;
          }
          console.log(def);
          this.barHeight = def;
          this.barWidth = this.width * .8;
          this.i = 0;
          this.duration = 750;
          this.tree = tree().size([this.width, this.height]);
          this.tree = tree().nodeSize([0, 30]);

          //here data should also be passed by the on init function optionally
          var used_data = newdata || data;
          this.root = this.tree(hierarchy(used_data));
          this.root.each(function (d) {
              d.name_to_print = d.id; //transferring name to a name variable
              d.id = _this.i; //Assigning numerical Ids
              _this.i++;
          });
          this.root.x0 = this.root.x;
          this.root.y0 = this.root.y;
          //svg should always be reset on init
          var myNode = document.getElementById('patient-svg');
          if (myNode) {
            myNode.parentNode.removeChild(myNode);
          }
          this.svg = select('#patient-tree').append('svg')
              .attr("id", "patient-svg")
              .attr('width', this.width + this.margin.right + this.margin.left)
              .attr('height', this.height + this.margin.top + this.margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
          if (collapsebool === false) {
            //expands whole tree
            if (expandall !== true)  {
              if (expandsearch !== true) {
                // this.expand(this.root);
                this.collapse(this.root);
              } else {
                this.root.children.forEach(this.collapseSpecific);
              }
            } else {
              this.expand(this.root);
            }
          } else {
            // only shows first-level children!
            // this.root.children.forEach(this.collapse);
            this.root.children.forEach(this.collapseLevel);
          }
          this.update(this.root);
      };
      return PatientTree;
  }());
  ;

  var DoctorTree = new DoctorTree();
  var PatientTree = new PatientTree();
  var original_Data = JSON.parse(JSON.stringify(data));
  var original_Data2 = JSON.parse(JSON.stringify(data));

  //helper functions check colors for a child node
  var validity = function(d) {
    var properties = data2;
    for(k in properties) {
      if ((d) && (properties[k].id_valor == d.id_valor)) {
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

  //make json object flat
  var lookup = {};
  var lookup2 = {};
  function mapIt (node) {
    lookup[node.name_to_print] = node;
    //recursive on all the children
    node.children && node.children.forEach(mapIt);
  }

  function mapIt2 (node) {
    lookup2[node.name_to_print] = node;
    //recursive on all the children
    node.children && node.children.forEach(mapIt2);
  }
  mapIt(original_Data);
  mapIt2(original_Data2);

  findParents = function(current_name, current_lookup) {
    var search = true;
    var path1 = [];
    while (search) {
      var found = false;
      for (var ind in current_lookup) {
        if (current_lookup[ind].children) {
            current_lookup[ind].children.forEach(function (d) {
              if (d.name_to_print === current_name) {
                path1.push(ind);
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
    return path1;
  }


  var new_obj = {};
  var new_obj2 = {};
  //count children with non valid score
  countChildren = function(new_obj, this_data) {
    if (this_data.children) {
      if (!new_obj.hasOwnProperty(this.name_to_print)) {
        new_obj[this.name_to_print] = 0;
      }
      this_data.children.forEach(function (d) {
          if (d.children) {
            if (!new_obj.hasOwnProperty(d.name_to_print)) {
              new_obj[d.name_to_print] = 0;
            }
            countChildren(new_obj, d);
          } else {
            //leaf nodes
            //check if negative, get all parent nodes names and add 1
            if(validity(d) === "falso") {
              var parent_list = findParents(d.name_to_print, lookup);
              for (var i = 0; i < parent_list.length; i++) {
                if (parent_list[i]) {
                  if (!new_obj.hasOwnProperty(parent_list[i])) {
                    new_obj[parent_list[i]] = 0;
                  }
                  new_obj[parent_list[i]] = new_obj[parent_list[i]] + 1;
                }
              }
            }

          }
      });
    } else {
      //leaf nodes
      //check if negative, get all parent nodes names and add 1
      if(validity(this_data) === "falso") {
        var parent_list = findParents(this_data.name_to_print, lookup);
        for (var i = 0; i < parent_list.length; i++) {
          if (parent_list[i]) {
            if (!new_obj.hasOwnProperty(parent_list[i])) {
              new_obj[parent_list[i]] = 0;
            }
            new_obj[parent_list[i]] = new_obj[parent_list[i]] + 1;
          }
        }
      }
    }
    return new_obj;
  };

  new_obj = countChildren(new_obj, data);
  new_obj2 = JSON.parse(JSON.stringify(new_obj));
  //adjust parent names
  adjustParents = function(obj) {
    if (obj.children) {
        //se tem filhos, modificar o nome do nó aqui
        var number_array = "(" + obj.name_to_print.split(" (")[1];
        var original_name = obj.name_to_print;
        var s_original_name = original_name.split(" (");
        var res = s_original_name[s_original_name.length - 1].match(/\d+\/(\d+)/);
        if (res) {
          obj.name_to_print = s_original_name[0] + " (" + new_obj[original_name] + "/" + res[1] + ")";
        } else {
          // console.log("bugging here:");
          // console.log(obj.name_to_print);
        }
        obj.children.forEach(function (d) {
            if (d.children) {
              adjustParents(d);
            } else {

            }
        });
    }
    return obj;
  };
  adjustParents(original_Data);
  adjustParents(original_Data2);
  lookup = {};
  lookup2 = {};

  mapIt(original_Data);
  mapIt2(original_Data2);

  DoctorTree.$onInit(original_Data);
  PatientTree.$onInit(original_Data2);
  console.log("about to init");
  var current_Data = original_Data;
  var current_Data2 = original_Data2;


  function resetviz() { //function for resetting the visualization view
    current_Data = original_Data;
    DoctorTree.$onInit(current_Data);
  };

  function resetviz2() { //function for resetting the visualization view
    current_Data2 = original_Data2;
    PatientTree.$onInit(current_Data);
  };

  //construct a sibling nodes for leaves
  var siblings = {};
  var siblings_ids = {};
  for (var ind in lookup) {
    if (!lookup[ind].depth) {
      var depth = 1;
      if (!siblings[lookup[ind].name_to_print]) {
        lookup[ind].depth = depth;
      } else {
        var current_parent = siblings[lookup[ind].name_to_print];
        while (current_parent) {
          var current_parent = siblings[current_parent];
          depth += 1;
        }
        lookup[ind].depth = depth;
      }
    }
    if (lookup[ind].children) {
        var parent_name = lookup[ind].name_to_print;
        lookup[ind].children.forEach(function (d) {
          siblings[d.name_to_print] = parent_name;
          if (!d.children) {
            siblings_ids[d.id_valor] = parent_name;
          }
        });
    }
  }

  var siblings2 = {};
  var siblings_ids2 = {};
  for (var ind in lookup2) {
    if (!lookup2[ind].depth) {
      var depth = 1;
      if (!siblings[lookup2[ind].name_to_print]) {
        lookup2[ind].depth = depth;
      } else {
        var current_parent = siblings2[lookup2[ind].name_to_print];
        while (current_parent) {
          var current_parent = siblings2[current_parent];
          depth += 1;
        }
        lookup2[ind].depth = depth;
      }
    }
    if (lookup2[ind].children) {
        var parent_name = lookup2[ind].name_to_print;
        lookup2[ind].children.forEach(function (d) {
          siblings2[d.name_to_print] = parent_name;
          if (!d.children) {
            siblings_ids2[d.id_valor] = parent_name;
          }
        });
    }
  }

  //criar funcao para combinar datas a partir dos paths finais
  if (reload_this) {
    var search = search;
    var only_neg = only_neg;
    renderMaster();
    renderMaster2();
  } else {
    var search = false;
    var only_neg = false;
  }

  function renderMaster(firstlevelbool, expandall) {
    if (firstlevelbool) {
      console.log("firstlevelbool!!!!");
    }
    var do_expand_all = false;
    if (expandall) {
      do_expand_all = true;
    }
    if (search === true) {
      var minhaBusca_results = minhaBusca(current_Data, lookup);
      // var search_Data = minhaBusca(current_Data, lookup);
      var search_Data = minhaBusca_results[0];
      var search_Data_Objs = minhaBusca_results[1];
      // console.log("search_Data");
      // console.log(search_Data);
      // console.log("search_Data_Objs");
      // console.log(search_Data_Objs);
    }
    if (only_neg === true) {
      var minhaFiltragem_results = minhaFiltragem();
      // var filter_Data = minhaFiltragem();
      var filter_Data = minhaFiltragem_results[0];
      var filter_Data_Objs = minhaFiltragem_results[1];
      // console.log("filter_Data");
      // console.log(filter_Data);
      // console.log("filter_Data_Objs");
      // console.log(filter_Data_Objs);
    }
    var falsity = false;
    var expandspec = false;
    if (search === true && only_neg === true) {
      //e preciso buscar
      var combined_paths = [];
      var validity_parents = {};
      var validity_children = {};

      function isAnyChildrenInside(obj, obj_name, wordList1, wordList2) {
          if (obj.children) {
            obj.children.forEach(function (c) {
                if (c.children) {
                  isAnyChildrenInside(c, obj_name, wordList1, wordList2);
                } else {
                  if (wordList1.indexOf(c.name_to_print) > -1 && ( (wordList2.indexOf(c.name_to_print) > -1) || (wordList2.indexOf(obj_name) > -1) )) {
                    validity_parents[obj_name] = true;
                  }
                }
            });
          } else {
            if (wordList1.indexOf(obj.name_to_print) > -1 && ( (wordList2.indexOf(obj.name_to_print) > -1) || (wordList2.indexOf(obj_name) > -1) )) {
              validity_parents[obj_name] = true;
            }
          }
      }

      for (var var_fil in filter_Data) {
        var fil_word = filter_Data[var_fil];
        var fil_obj = filter_Data_Objs[var_fil];
        if (fil_obj.children) {
          // console.log("fil_word");
          // console.log(fil_word);
          // console.log("fil_obj");
          // console.log(fil_obj);
          isAnyChildrenInside(fil_obj, fil_word, filter_Data, search_Data);
          if (validity_parents[fil_word] === true) {
            if (search_Data.indexOf(fil_word) > -1) {
              if (combined_paths.indexOf(fil_word) === -1) {
                combined_paths.push(fil_word);
              }
            }
          }
        } else  {
          if (search_Data.indexOf(fil_word) > -1) {
            //if the filtered children or its parent is inside
            if (combined_paths.indexOf(fil_word) === -1) {
              combined_paths.push(fil_word);
            }
          } else  {
            // console.log("not:");
            // console.log(fil_word);
          }
        }
      }

      // console.log(validity_parents);
      // console.log("combined_paths");
      // console.log(combined_paths);

      var filtered = filter_function([original_Data], combined_paths);
      expandspec = true;
    } else if (search === false && only_neg === true) {
      var filtered = filter_function([original_Data], filter_Data);
      // myTree.$onInit(filtered[0], false);
    } else if (search === true && only_neg === false) {
      //e preciso buscar
      var filtered = filter_function([original_Data], search_Data);
      // console.log("filtered");
      // console.log(filtered);
      expandspec = true;
    } else {
      //EDIT HERE
      var filtered = [original_Data];
      // var isChecked = $('#nivelone2').prop('checked');
      // if (isChecked) {
        // falsity = true;
      // }
      if (firstlevelbool) {
        console.log("firstlevelbool!!!!");
        falsity = true;
      }
    }
    // console.log("here!!!");
    // console.log(filtered[0]);
    // console.log(falsity);
    // console.log(expandspec);
    DoctorTree.$onInit(filtered[0], falsity, expandspec, do_expand_all);
    // falsity = false;
  };

  function renderMaster2(expandall) {
    var do_expand_all = false;
    if (expandall) {
      do_expand_all = true;
    }
    if (search === true) {
      var minhaBusca_results = minhaBusca(current_Data, lookup);
      // var search_Data = minhaBusca(current_Data, lookup);
      var search_Data = minhaBusca_results[0];
      var search_Data_Objs = minhaBusca_results[1];
      // var search_Data = minhaBusca(current_Data2, lookup2);
      // console.log("search_Data2");
      // console.log(search_Data);
    }
    var falsity = false;
    var expandspec = false;
    if (search === true) {
      //e preciso buscar
      console.log(original_Data2);
      console.log(search_Data);
      var filtered = filter_function([original_Data2], search_Data);
      console.log("filtered2");
      console.log(filtered);
      expandspec = true;
    } else {
      var filtered = [original_Data2];
      // var isChecked = $('#nivelone2').prop('checked');
      // if (isChecked) {
        // falsity = true;
      // }
    }
    PatientTree.$onInit(filtered[0], falsity, expandspec, do_expand_all);
  };

  var last_char = 0;
  $("#busca2").on('keyup', function (e) {
    // if ();
    // if (!document.getElementById("busca2").value) {
    //   document.getElementById('busca2').classList.remove("align-left");
    //   document.getElementById('busca2').classList.add("align-right");
    // } else {
    //   document.getElementById('busca2').classList.add("align-left");
    //   document.getElementById('busca2').classList.remove("align-right");
    // }
    if (document.getElementById("busca2").value.length > 1) {
      search = true;
      renderMaster();
      renderMaster2();
    } else if (document.getElementById("busca2").value.length === 0 && last_char > 0) {
      search = true;
      renderMaster();
      renderMaster2();
    }
    last_char = document.getElementById("busca2").value.length;
  });

  function minhaBusca(current_Data_a, current_lookup) {
    //https://leaverou.github.io/awesomplete/ autocomplete
    var input, filter, currentNodes, child_names, child_objs, parent_names, parent_objs;
      input = document.getElementById('busca2');
      filter = input.value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      currentNodes = current_Data_a;
      child_names = [];
      child_objs = [];
      parent_names = [];
      parent_objs = [];
      list_expandible = [];
      list_expandible2 = [];


      if (!filter) {
        search = false;
        list_expandible = [];
        list_expandible2 = [];
        return [[],[]];
      } else {
        //1: Pais e Filhos com match são separados

        //save parent level and leaf level search in separate arrays
        //leaves should always have all their parents as input for path
        //parent nodes should always have all their children as input for path
        getNameChildMatch = function (obj, child_names, child_objs, parent_names, parent_objs) {
            if (obj.name_to_print.toUpperCase().indexOf(filter) > -1) {
              parent_names.push(obj.name_to_print);
              parent_objs.push(obj);
            }
            if (obj.children) {
                obj.children.forEach(function (d) {
                    if (d.children) {
                      getNameChildMatch(d, child_names, child_objs, parent_names, parent_objs);
                    } else {
                      //leaf nodes
                      if (d.name_to_print.toUpperCase().indexOf(filter) > -1) {
                        child_names.push(d.name_to_print);
                        child_objs.push(d);
                      }
                    }
                });
            }
        }

        getNameChildMatch(currentNodes, child_names, child_objs, parent_names, parent_objs);

        var both_names1 = [].concat(child_names).concat(parent_names);
        var both_names = [].concat(child_names);
        var both_names_objs = [].concat(child_objs);

        //if parent node has any recursive child nodes inside both_names, it should be removed
        var new_parent_objs = [];
        if (child_names.length > 0) {
          for (var e_par in parent_names) {
            var e_obj = parent_objs[e_par];
            var e_nobj = parent_names[e_par];
            var add = true;
            for (e_ch1 in e_obj.children) {
              var e_ch_obj = e_obj.children[e_ch1];
              if (both_names1.indexOf(e_ch_obj.name_to_print) > -1) {
                 add = false;
              }
            }
            if (add === true) {
              if (e_obj.name_to_print) {
                both_names.push(e_obj.name_to_print);
                both_names_objs.push(e_obj);
                new_parent_objs.push(e_obj);
              }
            }
          }
        } else {
          both_names = [].concat(parent_names);
          both_names_objs = [].concat(parent_objs);
          new_parent_objs = new_parent_objs.concat(parent_objs);
        }

        if (both_names.length < 1) {
          search = false;
          list_expandible = [];
          list_expandible2 = [];
          return [[],[]];
        }

        console.log("current_lookup");
        console.log(current_lookup);
        //get parent elements not already in parent_names
        findParents = function(current_name, current_lookup) {
          var search = true;
          var path1 = [];
          var path1_objs = [];
          while (search) {
            var found = false;
            for (var ind in current_lookup) {
              if (current_lookup[ind].children) {
                  current_lookup[ind].children.forEach(function (d) {
                    if (d.name_to_print === current_name) {
                      path1.push(ind);
                      path1_objs.push(current_lookup[ind]);
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
          return [path1, path1_objs];
        }

        var path = [].concat(both_names);
        var path_objs = [].concat(both_names_objs);
        //add parents for each parent object not already in resultsNameArray
        for (var name in both_names) {
          var findResults = findParents(both_names[name], current_lookup)
          var currentParents = findResults[0];
          var currentParentsObjs = findResults[1];
          for (var name2 in currentParents) {
            if ((path.indexOf(currentParents[name2]) === -1) && (currentParents[name2])) {
              path.push(currentParents[name2]);
              path_objs.push(currentParentsObjs[name2]);
              list_expandible.push(currentParents[name2]);
              list_expandible2.push(currentParents[name2]);
            }
          }
        }

        var path2 = path.slice();;
        var path_objs2 = path_objs.slice();;

        //if parent node is unique, its children should be included in the list
        //if parent node is unique, its children should be RECURSIVELY included in the list
        //new_parent_objs



        for (var each_c in new_parent_objs) {
          var current_obj = new_parent_objs[each_c];
          if (current_obj) {
            var children_list = current_obj.children;
            for (var each_cc in children_list) {
              var current_children = children_list[each_cc];
              if ((path.indexOf(current_children.name_to_print) === -1) && (current_children)) {
                //get current_children name and it's recursive children names
                // var children_full_list = [];
                findChildren = function (obj) {
                  if (path.indexOf(obj.name_to_print) === -1) {
                    path.push(obj.name_to_print);
                  }
                  if (obj.children) {
                    obj.children.forEach(function (d) {
                      if (path.indexOf(d.name_to_print) === -1) {
                        path.push(d.name_to_print);
                      }
                      if (d.children) {
                        findChildren(d);
                      } else  {
                        if (path.indexOf(d.name_to_print) === -1) {
                          path.push(d.name_to_print);
                        }
                      }
                    });
                  } else  {
                    if (path.indexOf(obj.name_to_print) === -1) {
                      path.push(obj.name_to_print);
                    }
                  }
                };

                // path.push(current_children.name_to_print);
                findChildren(current_children);
                path_objs.push(current_children);
              }
            }
          }
        }
        // console.log("path");
        // console.log(path);

        //filter and rendering json object
        function filter2(array) {
          var result = [];
          array.forEach(function (a) {
              var temp = [],
                  o = {},
                  found = false;

              if (path.indexOf(a.name_to_print) !== -1) {
                  o.name_to_print = a.name_to_print;
                  if (a.id_valor) {
                    o.id_valor = a.id_valor;
                    o.id_metodo = a.id_metodo;
                    o.metodo = a.metodo;
                  }
                  found = true;
              }
              if (Array.isArray(a.children)) {
                  temp = filter2(a.children);
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
        }
        var filtered = filter2([currentNodes]);
        search = true;
        return [path, path_objs];
      }

  };

  function minhaFiltragem() {
    //get all invalid leave nodes
    getInvalidLeaves = function (obj, child_names, child_objects) {
        if (validity(obj) === "falso") {
          child_names.push(obj.name_to_print);
          child_objects.push(obj);
        }
        if (obj.children) {
            obj.children.forEach(function (d) {
                if (d.children) {
                  getInvalidLeaves(d, child_names, child_objects);
                } else {
                  if (validity(d) === "falso") {
                    child_names.push(d.name_to_print);
                    child_objects.push(d);
                  }
                }
            });
        }
    };
    var resultsNameArray = [];
    var resultsObjArray = [];

    getInvalidLeaves(current_Data, resultsNameArray, resultsObjArray);
    //get parents of invalid nodes
    findParents = function(current_name, current_lookup) {
      var search = true;
      var path1 = [];
      var path1_objs = [];
      while (search) {
        var found = false;
        for (var ind in current_lookup) {
          if (current_lookup[ind].children) {
              current_lookup[ind].children.forEach(function (d) {
                if (d.name_to_print === current_name) {
                  path1.push(ind);
                  path1_objs.push(current_lookup[ind]);
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
      return [path1, path1_objs];
    }

    var path = [].concat(resultsNameArray);
    var path_objs = [].concat(resultsObjArray);

    //add parents for each parent object not already in resultsNameArray
    for (var name in resultsNameArray) {
      var resultsParents = findParents(resultsNameArray[name], lookup);
      var currentParents = resultsParents[0];
      var currentParentsObjs = resultsParents[1];
      path = path.concat(currentParents);
      path_objs = path_objs.concat(currentParentsObjs);
    }

    var final_path = [];
    var final_path_objs = [];

    for (var ind_pat in path) {
      if (final_path.indexOf(path[ind_pat]) === -1) {
        final_path.push(path[ind_pat]);
        final_path_objs.push(path_objs[ind_pat]);
      }
    }
    path = final_path;
    path_objs = final_path_objs;
    //filter and rendering json object
    if (path.length < 1) {
      return [[],[]];
    } else {
      var filtered = filter_function([current_Data], path);
      return [path, path_objs];
    }
  };

  //listens to toggle button events
  $('#piramide1').change(function() {
    if (this.checked) {
      document.getElementById("image-2").classList.add("d-none");
      document.getElementById("image-4").classList.add("d-none");
      document.getElementById("image-3").classList.remove("d-none");
    } else {
      document.getElementById("image-3").classList.add("d-none");
      document.getElementById("image-4").classList.add("d-none");
      document.getElementById("image-2").classList.remove("d-none");
    }
  });

  //listens to events from main_display

  $("#nivelone1").click( function() {
    search = false;
    input = document.getElementById('busca2');
    input.value = "";
    resetviz2();

  });

  $("#todos1").click( function() {
    search = false;
    input = document.getElementById('busca2');
    input.value = "";
    renderMaster2(true);
  });

  $("#nivelone2").click( function() {
    document.getElementById("right-controls-do-in").classList.remove("d-none");
    if (document.getElementById("piramide1").disabled = true) {
      document.getElementById("piramide1").disabled = false;
      if (document.getElementById("piramide1").checked) {
        document.getElementById("image-2").classList.add("d-none");
        document.getElementById("image-4").classList.add("d-none");
        document.getElementById("image-3").classList.remove("d-none");
      } else {
        document.getElementById("image-3").classList.add("d-none");
        document.getElementById("image-4").classList.add("d-none");
        document.getElementById("image-2").classList.remove("d-none");
      }
    }
    search = false;
    only_neg = false;
    input = document.getElementById('busca2');
    input.value = "";
    resetviz();
  });

  $("#todos2").click( function() {
        document.getElementById("right-controls-do-in").classList.remove("d-none");
        search = false;
        only_neg = false;
        input = document.getElementById('busca2');
        input.value = "";
        if (document.getElementById("piramide1").disabled = true) {
          document.getElementById("piramide1").disabled = false;
          if (document.getElementById("piramide1").checked) {
            document.getElementById("image-2").classList.add("d-none");
            document.getElementById("image-4").classList.add("d-none");
            document.getElementById("image-3").classList.remove("d-none");
          } else {
            document.getElementById("image-3").classList.add("d-none");
            document.getElementById("image-4").classList.add("d-none");
            document.getElementById("image-2").classList.remove("d-none");
          }
        }
        renderMaster(false, true);
  });

  $("#outside2").click( function() {
        only_neg = true;
        renderMaster(false, true);
        //somente sumir com piramide:
        document.getElementById("right-controls-do-in").classList.add("d-none");
        document.getElementById("image-3").classList.add("d-none");
        document.getElementById("image-2").classList.add("d-none");
        document.getElementById("image-4").classList.remove("d-none");
  });

  document.getElementById('loadingDiv').classList.add('d-none');

  doctor_object_tree = DoctorTree;
};

function defineImageLinks(variable1, rerenderfalse) {
  data_image_links = variable1;
  console.log(data_image_links);
  if (!rerenderfalse) {
    renderTreeWhole();
  }
}

function doImageAjax(currentSex, birthData, examData, exam_ids, exam_values, rerenderfalse) {
  console.log(currentSex, birthData, examData, exam_ids, exam_values);
  document.getElementById('loadingDiv').classList.remove('d-none');
  $.ajax({
    url: "https://dan-reznik.ocpu.io/AzorPkg2/R/validate_exams/json?auto_unbox=true",
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({"sex": currentSex, "birth_ymd": birthData, "exam_ymd": examData, "ref_png":true, "exam_id_vec": exam_ids, "exam_value_vec": exam_values}),
    success: function (result_data) {
      // return result_data;
      // data_image_links = result_data;
      if (rerenderfalse) {
        defineImageLinks(result_data, rerenderfalse);
      } else {
        defineImageLinks(result_data);
      }
    },
    error: function(){
      alert("Cannot get data");
      return null;
    }
  });
  document.getElementById('loadingDiv').classList.add('d-none');
}

$(document).ready(function(){

  var currentSexa = $("input[name=exampleRadios]:checked").val() === "masculino" ? "M" : "F";
  var birthDataa = "19660720";
  var examDataa = "20180104";
  var exam_ids = [];
  var exam_values = [];
  for (var var_obj3 in data2) {
    if (data2[var_obj3]["value"] === null) {
      exam_ids.push(data2[var_obj3]["id_valor"]);
      exam_values.push([null]);
    } else {
      exam_ids.push(data2[var_obj3]["id_valor"]);
      exam_values.push(data2[var_obj3]["value"]);
    }
  }

  document.getElementById('loadingDiv').classList.remove('d-none');
  doImageAjax(currentSexa, birthDataa, examDataa, exam_ids, exam_values);
  document.getElementById('loadingDiv').classList.add('d-none');

  // console.log("data_image_links");
  // console.log(data_image_links);

});

function doAjax(currentSex, birthData, examData, new_data_rules, typerender) {
  document.getElementById('loadingDiv').classList.remove('d-none');
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
        var use_method = data_go[var_obj4].descr_metodo;
        var use_method_id = data_go[var_obj4].id_metodo;
        if (use_max) {
          data2[var_obj4].max = use_max;
          data2[var_obj4].min = use_min;
          data2[var_obj4].valid = use_valid;
          data2[var_obj4].metodo = use_method;
          data2[var_obj4].id_metodo = use_method_id;

        } else {
          data2[var_obj4].max = null;
          data2[var_obj4].min = null;
          data2[var_obj4].valid = null;
          data2[var_obj4].metodo = use_method;
          data2[var_obj4].id_metodo = use_method_id;
        }
      }

      // doctor_object_tree.$onUpdate(data2);
      renderTreeWhole(data2);
      // doctor_object_tree.$onExpand();
      // $("svg").find("g.node").click();

      document.getElementById("right-controls-do-in").classList.remove("d-none");
      if (document.getElementById("piramide1").disabled = true) {
        document.getElementById("piramide1").disabled = false;
        if (document.getElementById("piramide1").checked) {
          document.getElementById("image-2").classList.add("d-none");
          document.getElementById("image-4").classList.add("d-none");
          document.getElementById("image-3").classList.remove("d-none");
        } else {
          document.getElementById("image-3").classList.add("d-none");
          document.getElementById("image-4").classList.add("d-none");
          document.getElementById("image-2").classList.remove("d-none");
        }
      }
      $("#nivelone").prop("checked", true);
      $("#nivelone2").prop("checked", true);
    },
    error: function(){
      alert("Cannot get data");
    }
  });
  document.getElementById('loadingDiv').classList.add('d-none');

}

$( "#datepicker" ).datepicker({
  dateFormat: 'dd/mm/yy',
  onSelect: function(dateText) {
    //get current birth date
    var birthData = $( "#datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).val().split("/");
    birthData = birthData[2] + ("00" + birthData[1]).slice(-2) + ("00" + birthData[0]).slice(-2);
    //validate birth date

    //get current exam data
    var examData = $( "#datepicker2" ).datepicker({ dateFormat: 'yy-mm-dd' }).val().split("/");
    examData = examData[2] + ("00" + examData[1]).slice(-2) + ("00" + examData[0]).slice(-2);
    //validate exam date

    //get current sex
    var currentSex = $("input[name=exampleRadios]:checked").val() === "masculino" ? "M" : "F";

    //get current exam ids and values
    var new_data_rules = [];
    for (var var_obj3 in data2) {
      new_data_obj = {}
      new_data_obj["id"] = data2[var_obj3]["id_valor"];
      if (data2[var_obj3]["value"] === null) {
        new_data_obj["value"] = [null];
      } else {
        new_data_obj["value"] = data2[var_obj3]["value"];
      }
      new_data_rules.push(new_data_obj);
    }

    document.getElementById('loadingDiv').classList.remove('d-none');

    var exam_ids = [];
    var exam_values = [];
    for (var var_obj3 in data2) {
      if (data2[var_obj3]["value"] === null) {
        exam_ids.push(data2[var_obj3]["id_valor"]);
        exam_values.push([null]);
      } else {
        exam_ids.push(data2[var_obj3]["id_valor"]);
        exam_values.push(data2[var_obj3]["value"]);
      }
    }

    doImageAjax(currentSex, birthData, examData, exam_ids, exam_values, true);

    doAjax(currentSex, birthData, examData, new_data_rules);



    document.getElementById('loadingDiv').classList.add('d-none');

  }
});

//Set DatePicker to July 2, 1966
$('#datepicker').datepicker("setDate", new Date(1966,6,02) );

$("#datepicker").bind('click',function () {
  $('#datepicker').datepicker('show');
});

$( "#datepicker2" ).datepicker({
  dateFormat: 'dd/mm/yy',
  onSelect: function(dateText) {
    //get current birth date
    var birthData = $( "#datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).val().split("/");
    birthData = birthData[2] + ("00" + birthData[1]).slice(-2) + ("00" + birthData[0]).slice(-2);
    //validate birth date

    //get current exam data
    var examData = $( "#datepicker2" ).datepicker({ dateFormat: 'yy-mm-dd' }).val().split("/");
    examData = examData[2] + ("00" + examData[1]).slice(-2) + ("00" + examData[0]).slice(-2);
    //validate exam date

    //get current sex
    var currentSex = $("input[name=exampleRadios]:checked").val() === "masculino" ? "M" : "F";

    //get current exam ids and values
    var new_data_rules = [];
    for (var var_obj3 in data2) {
      new_data_obj = {}
      new_data_obj["id"] = data2[var_obj3]["id_valor"];
      if (data2[var_obj3]["value"] === null) {
        new_data_obj["value"] = [null];
      } else {
        new_data_obj["value"] = data2[var_obj3]["value"];
      }
      new_data_rules.push(new_data_obj);
    }
    document.getElementById('loadingDiv').classList.remove('d-none');

    var exam_ids = [];
    var exam_values = [];
    for (var var_obj3 in data2) {
      if (data2[var_obj3]["value"] === null) {
        exam_ids.push(data2[var_obj3]["id_valor"]);
        exam_values.push([null]);
      } else {
        exam_ids.push(data2[var_obj3]["id_valor"]);
        exam_values.push(data2[var_obj3]["value"]);
      }
    }

    doImageAjax(currentSex, birthData, examData, exam_ids, exam_values, true);

    doAjax(currentSex, birthData, examData, new_data_rules);

    document.getElementById('loadingDiv').classList.add('d-none');
  }

});

$('#datepicker2').datepicker("setDate", new Date(2018,00,01) );

$("#datepicker2").bind('click',function () {
  $('#datepicker2').datepicker('show');
});

//radio buttons pregnant option rendering
var rad = document.getElementsByName("exampleRadios");
var prev = null;
for(var i = 0; i < rad.length; i++) {
  rad[i].onclick = function() {
    (prev)? console.log(prev.value):null;
    if(this !== prev) {
      prev = this;
      //get current birth date
      var birthData = $( "#datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).val().split("/");
      birthData = birthData[2] + ("00" + birthData[1]).slice(-2) + ("00" + birthData[0]).slice(-2);
      //validate birth date

      //get current exam data
      var examData = $( "#datepicker2" ).datepicker({ dateFormat: 'yy-mm-dd' }).val().split("/");
      examData = examData[2] + ("00" + examData[1]).slice(-2) + ("00" + examData[0]).slice(-2);
      //validate exam date

      //get current sex
      var currentSex = $("input[name=exampleRadios]:checked").val() === "masculino" ? "M" : "F";

      //get current exam ids and values
      var new_data_rules = [];
      for (var var_obj3 in data2) {
        new_data_obj = {}
        new_data_obj["id"] = data2[var_obj3]["id_valor"];
        if (data2[var_obj3]["value"] === null) {
          new_data_obj["value"] = [null];
        } else {
          new_data_obj["value"] = data2[var_obj3]["value"];
        }
        new_data_rules.push(new_data_obj);
      }

      var exam_ids = [];
      var exam_values = [];
      for (var var_obj3 in data2) {
        if (data2[var_obj3]["value"] === null) {
          exam_ids.push(data2[var_obj3]["id_valor"]);
          exam_values.push([null]);
        } else {
          exam_ids.push(data2[var_obj3]["id_valor"]);
          exam_values.push(data2[var_obj3]["value"]);
        }
      }

      doImageAjax(currentSex, birthData, examData, exam_ids, exam_values, true);

      document.getElementById('loadingDiv').classList.remove('d-none');
      doAjax(currentSex, birthData, examData, new_data_rules);

      document.getElementById('loadingDiv').classList.add('d-none');
    }
    if (this.value === "feminino") {
      document.getElementById('checkboxgravida').classList.remove("d-none");
    } else {
      document.getElementById('checkboxgravida').classList.add("d-none");
    }
  };

}
