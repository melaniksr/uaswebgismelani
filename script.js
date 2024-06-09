// // 1. Menambahkan Elemen Dasar Peta Pada Halaman HTML
    // 1.1 Membuat Variabel Peta dan Melakukan Set View Halaman Peta di Lokasi Tertentu
    const map = L.map('map')
    map.setView([-7.2575, 112.7521], 12);
    // 1.2 Menambahkan Basemap OSM
    const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    // 1.3 Menambahkan Basemap OSM HOT
    const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});
    // 1.4 Menambahkan Basemap Google
    const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 19,
        attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
        subdomains:['mt0','mt1','mt2','mt3']});
    // 1.5 Menambahkan Fitur Fullscreen Peta
    map.addControl(new L.Control.Fullscreen());
    // 1.6 Menambahkan Tombol Home (Zoom to Extent)
    const home = {
        lat: -7.2575,
        lng: 112.7521,
        zoom: 12
    };
    L.easyButton('fa-home', function (btn, map) {
        map.setView([home.lat, home.lng], home.zoom);
    }, 'Zoom To Home').addTo(map)
    // 1.7 Menambahkan Fitur My Location
    map.addControl(
        L.control.locate({
            locateOptions: {
                enableHighAccuracy: true
            }
        })
    );
// // 2. Menambahkan Data Spasial Pada WebGIS
//     // 2.1 Data Batas Administrasi (Line)
        const adminKelurahanAR = new L.LayerGroup();
        $.getJSON("./asset/data-spasial/batas_administrasi.json", function (OBJECTID) {
            L.geoJSON(OBJECTID, {
                style: {
                    color : "black",
                    weight : 2,
                    opacity : 1,
                    dashArray: '3,3,20,3,20,3,20,3,20,3,20',
                    lineJoin: 'round'
                }
            }).addTo(adminKelurahanAR);
        });
        adminKelurahanAR.addTo(map); // Apabila tidak dibutuhkan jadikan komen saja
       // 2.2 Data Aliran Sungai (Line)
        const sungai = new L.LayerGroup();
        $.getJSON("./asset/data-spasial/sungai.json", function (OBJECTID) {
            L.geoJSON(OBJECTID, {
                style: {
                    color : "#00BFFF",
                    weight : 2,
                    opacity : 1,
                    lineJoin: 'round'
                }
            }).addTo(sungai);
        });
        sungai.addTo(map); // Apabila tidak dibutuhkan jadikan komen saja
    // 2.2 Data Daerah Rawan Banjir (Polygon)
        const banjir = new L.LayerGroup();
        // 2.2.3 Contoh Penggunaan Saat Klasifikasi Didasarkan Pada Kuantitas Data, contoh pada script ini, rentang dari Object ID
        $.getJSON("./asset/data-spasial/indeks_bahaya_banjir.geojson", function (gridcode) {
            L.geoJson(gridcode, {
                style: function (feature) {
                    var fillColor, gridcode = feature.properties.gridcode;
                    var colorMap = {
                        '1': '#00FF00 ',
                        '2': '#FFFF00',
                        '3': '#ff0000'
                      };
                      fillColor = colorMap[Math.floor(gridcode)];
                    return { color: "#999", weight: 0, fillColor: fillColor, fillOpacity: 0.7 };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('<b>Wilayah KRB: </b>' + feature.properties.gridcode)
                }

            }).addTo(banjir);
        });
        banjir.addTo(map); // Apabila tidak dibutuhkan jadikan komen saja

// // 3. Membuat Layer Control
    // 3.1 Basemap
    const baseMaps = {
        "Openstreetmap" : basemapOSM,
        "OSM HOT" : osmHOT,
        "Google" : baseMapGoogle
    };

//     // 3.2 Layer Data GEOJSON
    const overlayMaps = {
        "Sungai" : sungai,
        "Batas Administrasi" : adminKelurahanAR,
        "Indeks Bahaya Banjir": banjir
        // "Contoh Data URL Eksternal": dataTambahan
    };

//     // 3.3 Memanggil Fungsi Layer Control
    L.control.layers(baseMaps,overlayMaps).addTo(map);

    // 3.4 Menambahkan Legenda Pada Peta
    let legend = L.control({ position: "topright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML =
            // Judul Legenda
            '<p style= "font-size: 18px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Legenda</p>' +
            // Legenda Layer Batas Administrasi
            '<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Batas Administrasi</p>'+
            '<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:rgb(0,0,0);stroke-dasharray:10 1 1 1 1 1 1 1 1 1"/></svg></div>Batas Kecamatan<br>'+
           // Legenda Layer Sungai
            '<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Sungai</p>'+
            '<div><svg><line x1="0" y1="11" x2="23" y2="11" style="stroke-width:2;stroke:#00BFFF;"/></svg></div>Sungai<br>'+
            // Legenda Layer Tutupan Lahan
            '<p style= "font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px">Indeks Bahaya Banjir</p>' +
            '<div style="background-color: #00FF00"></div>Rendah<br>' +
            '<div style="background-color: #FFFF00"></div>Sedang<br>' +
            '<div style="background-color: #ff0000"></div>Tinggi<br>' ;
            return div;
        };
        legend.addTo(map);