/**
 * Created by Cam on 2/10/2017.
 */
var COLUMN_TYPE = ['todo', 'doing', 'done'];
var DB = {
    getData: function () {
        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            var data;
            try {
                data = JSON.parse(localStorage.getItem('list')) || {};
            } catch (error) {
                data = {};
            }
            return data;
        } else {
            alert("Sorry! No Web Storage support..");
            return {};
        }
    },
    setData: function (data) {
        localStorage.setItem('list', JSON.stringify(data));
    }
};
var list = DB.getData();
var app = {
    newJob: function (e, type, input, option = false) {

        var jobName = $(input).val();
        var event = window.event || e;
        if (event.keyCode === 13 && jobName.trim() !== '') {

            if (!list[type]) list[type] = [];
            list[type].push(jobName);
            DB.setData(list);
            // update DOM
            this.addJobToList(type, jobName);
            //reset input
            $(input).val('');

            if(option){
                input.remove();
            }
        }


    },
    addJobToList: function (type, jobName,i) {
        var item = ' <div data-key="'+i+'" href="#!" class="collection-item">' + jobName +
            '<span class="badge" onclick="app.editJob(this,\''+type+'\')" ><i class="tiny material-icons right">mode_edit</i></span><span class="badge" onclick="app.deleteJob(this)"><i class="tiny material-icons right">delete</i></span></div>';
        $('#' + type).append(item);
    },
    deleteJob: function (span) {
        var modal = $('#modal-confirm').modal();
        var btn = $('#btn-delete');
        var item = $(span).parent();//tim  den the cha
        modal.modal('open');
        btn.off('click');// off event
        btn.on('click', function () {
            var columnType = item.parent().attr('id');// get id element cha
            var itemPosition = $('#' + columnType + '.collection-item').index(item);// get index for element in []
            list[columnType].splice(itemPosition, 1);
            DB.setData(list);
            item.remove();
            modal.modal('close');
        });

    },
    editJob: function (el, type) {

        var event = window.event;
        // console.log(e);
        var col_item = $(el).parent();
        col_item.on('click', function () {
            var $input = $("<input>", {
                val: $(this).text(),
                type: "text"
            });
            $input.addClass("collection-item");
            var pos = $('.collection-item').index(col_item);

            $(this).replaceWith($input);
            var job = $input.val();
            $input.attr({
                onkeydown: "app.updateJob("+pos+", '"+type+"', this)"
            });
            // console.log(col_item);
        });
    },
    updateJob: function (pos,type, input) {
        
    }
};


$(function () {
    COLUMN_TYPE.forEach(function (type) {
        var columnType = list[type] || [];
        columnType.forEach(function (jobName,i) {
            app.addJobToList(type, jobName,i);
        })
    });
    $('.sorted-list').sortable({
        connectWith: '.sorted-list',
        placeholder: 'ui-state-highlight',
        start: function (event, ui) {
            // add style class
            $(ui.item[0]).addClass('dragging');
            ui.item.oldColumnType = ui.item.context.parentElement.getAttribute('id');
            ui.item.oldItemPosition = ui.item.index();

        },
        stop: function (event, ui) {
            // remove style class
            $(ui.item[0]).removeClass('dragging');
            var item = ui.item;
            var oldColumnType = item.oldColumnType;
            var oldItemPosition = item.oldItemPosition;
            var newColumnType = ui.item.context.parentElement.getAttribute('id');
            var newItemPosition = item.index();
            //remove item from old position
            list[oldColumnType].splice(oldItemPosition, 1);

            //add item to new position

            list[newColumnType].splice(newItemPosition, 0, item[0].innerText);
            //console.log(item[0].innerText);
            //store data to localstorage
            DB.setData(list);
        }
    });
});