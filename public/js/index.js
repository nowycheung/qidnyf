var F = {
    loadItem: function (data) {
        var dataString = "itemId=",
            cartContainer = document.querySelector(data.targetNode);
        
        // If user cart is empty
        if (data.items && data.items.length === 0) {
            cartContainer.innerHTML = "";
            return;
        }

        // List all items in product list
        if (!data.items) {
            this.ajax("/ajax", "", function(data){
                var txt = "";
                data.forEach(function(item){
                    txt += "<tr>";
                    txt += '<td class="W-20 L-screen"><img src="' + item.img + '" class="W-100"></td>';
                    txt += '<td class="W-20">' + item.brand + '</td>';
                    txt += '<td class="W-40 L-screen">' + item.description + '</td>';
                    txt += '<td class="">' + item.price + '</td>';
                    txt += '<td class="W-10 M-screen">' + item.count + '</td>';
                    txt += '<td class="W-10"><a href="/costumer?action=addItem&itemId=' + item.id +'"><i class="fa fa-shopping-cart F-m"></i></a></td>';
                    txt += "</tr>";
                });
                cartContainer.innerHTML = txt;
            });
        } else {
            dataString += data.items.join(",");
            this.ajax("/ajax", dataString, function(data){
                var txt = "";
                data.forEach(function(item){
                    txt += "<tr>";
                    txt += '<td class="W-20 L-screen"><img src="' + item.img + '" class="W-100"></td>';
                    txt += '<td class="W-20">' + item.brand + '</td>';
                    txt += '<td class="W-40 L-screen">' + item.description + '</td>';
                    txt += '<td class="W-10 M-screen">' + item.price + '</td>';
                    txt += '<td class="W-10"><a href="/costumer?action=removeItem&itemId=' + item.id +'"><i class="fa fa-trash-o F-m"></i></a></td>';
                    txt += "</tr>";
                });
                cartContainer.innerHTML = txt;
            });
        }
    },
    ajax: function(url, dataString, cb) {
        var r = new XMLHttpRequest(); 
        r.open("GET", "/ajax?" + dataString, true);
        r.onreadystatechange = function () {
            if (r.readyState != 4 || r.status != 200){
                return;
            }
            cb(JSON.parse(r.responseText));
        };
        r.send(null);
    }
}
