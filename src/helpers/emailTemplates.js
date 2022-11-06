const templateEmailPassRecovery = (nombre, fecha, codigo) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    style="font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif"
  >
    <head>
      <meta charset="UTF-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta content="telephone=no" name="format-detection" />
      <title>EcoPlastic</title>
      <!--[if (mso 16)]>
        <style type="text/css">
          a {
            text-decoration: none;
          }
        </style>
      <![endif]-->
      <!--[if gte mso 9
        ]><style>
          sup {
            font-size: 100% !important;
          }
        </style><!
      [endif]-->
      <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG></o:AllowPNG>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit&display=swap"
        rel="stylesheet"
      />
      <!--<![endif]-->
      <style type="text/css">
        .rollover div {
          font-size: 0;
        }
        .rollover:hover .rollover-first {
          max-height: 0px !important;
          display: none !important;
        }
        .rollover:hover .rollover-second {
          max-height: none !important;
          display: block !important;
        }
        #outlook a {
          padding: 0;
        }
        .es-button {
          mso-style-priority: 100 !important;
          text-decoration: none !important;
        }
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
        .es-desk-hidden {
          display: none;
          float: left;
          overflow: hidden;
          width: 0;
          max-height: 0;
          line-height: 0;
          mso-hide: all;
        }
        [data-ogsb] .es-button {
          border-width: 0 !important;
          padding: 10px 30px 10px 30px !important;
        }
        .es-button-border:hover a.es-button,
        .es-button-border:hover button.es-button {
          background: #02745d !important;
          border-color: #02745d !important;
          color: #ffffff !important;
        }
        .es-button-border:hover {
          border-color: #42d159 #42d159 #42d159 #42d159 !important;
          background: #02745d !important;
        }
        @media only screen and (max-width: 600px) {
          p,
          ul li,
          ol li,
          a {
            line-height: 150% !important;
          }
          h1,
          h2,
          h3,
          h1 a,
          h2 a,
          h3 a {
            line-height: 120%;
          }
          h1 {
            font-size: 30px !important;
            text-align: left;
          }
          h2 {
            font-size: 24px !important;
            text-align: left;
          }
          h3 {
            font-size: 20px !important;
            text-align: left;
          }
          .es-header-body h1 a,
          .es-content-body h1 a,
          .es-footer-body h1 a {
            font-size: 30px !important;
            text-align: left;
          }
          .es-header-body h2 a,
          .es-content-body h2 a,
          .es-footer-body h2 a {
            font-size: 24px !important;
            text-align: left;
          }
          .es-header-body h3 a,
          .es-content-body h3 a,
          .es-footer-body h3 a {
            font-size: 20px !important;
            text-align: left;
          }
          .es-menu td a {
            font-size: 12px !important;
          }
          .es-header-body p,
          .es-header-body ul li,
          .es-header-body ol li,
          .es-header-body a {
            font-size: 14px !important;
          }
          .es-content-body p,
          .es-content-body ul li,
          .es-content-body ol li,
          .es-content-body a {
            font-size: 14px !important;
          }
          .es-footer-body p,
          .es-footer-body ul li,
          .es-footer-body ol li,
          .es-footer-body a {
            font-size: 12px !important;
          }
          .es-infoblock p,
          .es-infoblock ul li,
          .es-infoblock ol li,
          .es-infoblock a {
            font-size: 12px !important;
          }
          *[class="gmail-fix"] {
            display: none !important;
          }
          .es-m-txt-c,
          .es-m-txt-c h1,
          .es-m-txt-c h2,
          .es-m-txt-c h3 {
            text-align: center !important;
          }
          .es-m-txt-r,
          .es-m-txt-r h1,
          .es-m-txt-r h2,
          .es-m-txt-r h3 {
            text-align: right !important;
          }
          .es-m-txt-l,
          .es-m-txt-l h1,
          .es-m-txt-l h2,
          .es-m-txt-l h3 {
            text-align: left !important;
          }
          .es-m-txt-r img,
          .es-m-txt-c img,
          .es-m-txt-l img {
            display: inline !important;
          }
          .es-button-border {
            display: inline-block !important;
          }
          a.es-button,
          button.es-button {
            font-size: 18px !important;
            display: inline-block !important;
          }
          .es-adaptive table,
          .es-left,
          .es-right {
            width: 100% !important;
          }
          .es-content table,
          .es-header table,
          .es-footer table,
          .es-content,
          .es-footer,
          .es-header {
            width: 100% !important;
            max-width: 600px !important;
          }
          .es-adapt-td {
            display: block !important;
            width: 100% !important;
          }
          .adapt-img {
            width: 100% !important;
            height: auto !important;
          }
          .es-m-p0 {
            padding: 0 !important;
          }
          .es-m-p0r {
            padding-right: 0 !important;
          }
          .es-m-p0l {
            padding-left: 0 !important;
          }
          .es-m-p0t {
            padding-top: 0 !important;
          }
          .es-m-p0b {
            padding-bottom: 0 !important;
          }
          .es-m-p20b {
            padding-bottom: 20px !important;
          }
          .es-mobile-hidden,
          .es-hidden {
            display: none !important;
          }
          tr.es-desk-hidden,
          td.es-desk-hidden,
          table.es-desk-hidden {
            width: auto !important;
            overflow: visible !important;
            float: none !important;
            max-height: inherit !important;
            line-height: inherit !important;
          }
          tr.es-desk-hidden {
            display: table-row !important;
          }
          table.es-desk-hidden {
            display: table !important;
          }
          td.es-desk-menu-hidden {
            display: table-cell !important;
          }
          .es-menu td {
            width: 1% !important;
          }
          table.es-table-not-adapt,
          .esd-block-html table {
            width: auto !important;
          }
          table.es-social {
            display: inline-block !important;
          }
          table.es-social td {
            display: inline-block !important;
          }
          .es-m-p5 {
            padding: 5px !important;
          }
          .es-m-p5t {
            padding-top: 5px !important;
          }
          .es-m-p5b {
            padding-bottom: 5px !important;
          }
          .es-m-p5r {
            padding-right: 5px !important;
          }
          .es-m-p5l {
            padding-left: 5px !important;
          }
          .es-m-p10 {
            padding: 10px !important;
          }
          .es-m-p10t {
            padding-top: 10px !important;
          }
          .es-m-p10b {
            padding-bottom: 10px !important;
          }
          .es-m-p10r {
            padding-right: 10px !important;
          }
          .es-m-p10l {
            padding-left: 10px !important;
          }
          .es-m-p15 {
            padding: 15px !important;
          }
          .es-m-p15t {
            padding-top: 15px !important;
          }
          .es-m-p15b {
            padding-bottom: 15px !important;
          }
          .es-m-p15r {
            padding-right: 15px !important;
          }
          .es-m-p15l {
            padding-left: 15px !important;
          }
          .es-m-p20 {
            padding: 20px !important;
          }
          .es-m-p20t {
            padding-top: 20px !important;
          }
          .es-m-p20r {
            padding-right: 20px !important;
          }
          .es-m-p20l {
            padding-left: 20px !important;
          }
          .es-m-p25 {
            padding: 25px !important;
          }
          .es-m-p25t {
            padding-top: 25px !important;
          }
          .es-m-p25b {
            padding-bottom: 25px !important;
          }
          .es-m-p25r {
            padding-right: 25px !important;
          }
          .es-m-p25l {
            padding-left: 25px !important;
          }
          .es-m-p30 {
            padding: 30px !important;
          }
          .es-m-p30t {
            padding-top: 30px !important;
          }
          .es-m-p30b {
            padding-bottom: 30px !important;
          }
          .es-m-p30r {
            padding-right: 30px !important;
          }
          .es-m-p30l {
            padding-left: 30px !important;
          }
          .es-m-p35 {
            padding: 35px !important;
          }
          .es-m-p35t {
            padding-top: 35px !important;
          }
          .es-m-p35b {
            padding-bottom: 35px !important;
          }
          .es-m-p35r {
            padding-right: 35px !important;
          }
          .es-m-p35l {
            padding-left: 35px !important;
          }
          .es-m-p40 {
            padding: 40px !important;
          }
          .es-m-p40t {
            padding-top: 40px !important;
          }
          .es-m-p40b {
            padding-bottom: 40px !important;
          }
          .es-m-p40r {
            padding-right: 40px !important;
          }
          .es-m-p40l {
            padding-left: 40px !important;
          }
          .es-desk-hidden {
            display: table-row !important;
            width: auto !important;
            overflow: visible !important;
            max-height: inherit !important;
          }
        }
      </style>
    </head>
    <body
      style="
        width: 100%;
        font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        padding: 0;
        margin: 0;
      "
    >
      <div class="es-wrapper-color" style="background-color: #f6f6f6">
        <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
          </v:background>
        <![endif]-->
        <table
          class="es-wrapper"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            border-spacing: 0px;
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            background-repeat: repeat;
            background-position: center top;
            background-color: #f6f6f6;
          "
        >
          <tr>
            <td valign="top" style="padding: 0; margin: 0">
              <table
                cellpadding="0"
                cellspacing="0"
                class="es-header"
                align="center"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  table-layout: fixed !important;
                  width: 100%;
                  background-color: transparent;
                  background-repeat: repeat;
                  background-position: center top;
                "
              >
                <tr>
                  <td align="center" style="padding: 0; margin: 0">
                    <table
                      bgcolor="#ffffff"
                      class="es-header-body"
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse;
                        border-spacing: 0px;
                        background-color: #f6f3eb;
                        width: 600px;
                      "
                    >
                      <tr>
                        <td
                          align="left"
                          style="
                            margin: 0;
                            padding-bottom: 10px;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="left"
                                class="es-m-p20b"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-bottom: 15px;
                                        font-size: 0px;
                                      "
                                    >
                                      <a
                                        target="_blank"
                                        href=""
                                        style="
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          text-decoration: underline;
                                          color: #666666;
                                          font-size: 14px;
                                        "
                                        ><img
                                          src="https://aiijci.stripocdn.email/content/guids/af010813-93ef-4d11-a072-30c5be9fc4f3/images/whatsapp_image_20221105_at_15427_pm.jpeg"
                                          alt="Logo"
                                          style="
                                            display: block;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                            -ms-interpolation-mode: bicubic;
                                          "
                                          height="70"
                                          title="Logo"
                                      /></a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table
                class="es-content"
                cellspacing="0"
                cellpadding="0"
                align="center"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  table-layout: fixed !important;
                  width: 100%;
                "
              >
                <tr>
                  <td align="center" style="padding: 0; margin: 0">
                    <table
                      class="es-content-body"
                      cellspacing="0"
                      cellpadding="0"
                      align="center"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse;
                        border-spacing: 0px;
                        background-color: #a8d87e;
                        width: 600px;
                      "
                    >
                      <tr>
                        <td
                          align="left"
                          style="padding: 0; margin: 0; padding-bottom: 20px"
                        >
                          <table
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                class="es-m-p0r"
                                valign="top"
                                align="center"
                                style="padding: 0; margin: 0; width: 600px"
                              >
                                <table
                                  width="100%"
                                  cellspacing="0"
                                  cellpadding="0"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        font-size: 0px;
                                      "
                                    >
                                      <a
                                        target="_blank"
                                        href=""
                                        style="
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          text-decoration: underline;
                                          color: #02604d;
                                          font-size: 14px;
                                        "
                                        ><img
                                          class="adapt-img"
                                          src="https://aiijci.stripocdn.email/content/guids/CABINET_f4f8be13dd07ed085a349f5fd969d18a/images/5657176_1_ogI.png"
                                          alt="día de la paz verde"
                                          style="
                                            display: block;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                            -ms-interpolation-mode: bicubic;
                                          "
                                          width="600"
                                          title="día de la paz verde"
                                      /></a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table
                cellpadding="0"
                cellspacing="0"
                class="es-content"
                align="center"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  table-layout: fixed !important;
                  width: 100%;
                "
              >
                <tr>
                  <td align="center" style="padding: 0; margin: 0">
                    <table
                      bgcolor="#A8D87E"
                      class="es-content-body"
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse;
                        border-spacing: 0px;
                        background-color: #a8d87e;
                        width: 600px;
                      "
                    >
                      <tr>
                        <td
                          class="es-m-p20r es-m-p20l"
                          align="left"
                          background="https://aiijci.stripocdn.email/content/guids/CABINET_f4f8be13dd07ed085a349f5fd969d18a/images/group_32_Dyn.png"
                          style="
                            margin: 0;
                            padding-top: 20px;
                            padding-bottom: 20px;
                            padding-left: 40px;
                            padding-right: 40px;
                            background-image: url(https://aiijci.stripocdn.email/content/guids/CABINET_f4f8be13dd07ed085a349f5fd969d18a/images/group_32_Dyn.png);
                            background-repeat: no-repeat;
                            background-position: center bottom;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="center"
                                valign="top"
                                style="padding: 0; margin: 0; width: 520px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-top: 10px;
                                        padding-bottom: 10px;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: helvetica, 'helvetica neue',
                                            arial, verdana, sans-serif;
                                          line-height: 21px;
                                          color: #02604d;
                                          font-size: 14px;
                                        "
                                      >
                                        <font style="vertical-align: inherit"
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          ><font
                                                            style="
                                                              vertical-align: inherit;
                                                            "
                                                            >${fecha}</font
                                                          ></font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></font
                                        >
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      class="es-m-txt-c es-m-p0r es-m-p0l"
                                      style="
                                        margin: 0;
                                        padding-top: 10px;
                                        padding-bottom: 10px;
                                        padding-left: 40px;
                                        padding-right: 40px;
                                      "
                                    >
                                      <h1
                                        style="
                                          margin: 0;
                                          line-height: 60px;
                                          mso-line-height-rule: exactly;
                                          font-family: Kanit, sans-serif;
                                          font-size: 30px;
                                          font-style: normal;
                                          font-weight: bold;
                                          color: #f6f3eb;
                                        "
                                      >
                                        <font style="vertical-align: inherit"
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    >Código de recuperación de
                                                    contraseña</font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></font
                                        >
                                      </h1>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      class="es-m-p0r es-m-p0l"
                                      style="
                                        margin: 0;
                                        padding-top: 10px;
                                        padding-bottom: 30px;
                                        padding-left: 40px;
                                        padding-right: 40px;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: helvetica, 'helvetica neue',
                                            arial, verdana, sans-serif;
                                          line-height: 21px;
                                          color: #02604d;
                                          font-size: 14px;
                                          text-align: left;
                                        "
                                      >
                                        <font style="vertical-align: inherit"
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          ><font
                                                            style="
                                                              vertical-align: inherit;
                                                            "
                                                            ><font
                                                              style="
                                                                vertical-align: inherit;
                                                              "
                                                              ><font
                                                                style="
                                                                  vertical-align: inherit;
                                                                "
                                                                ><strong
                                                                  ><font
                                                                    style="
                                                                      vertical-align: inherit;
                                                                    "
                                                                    ><font
                                                                      style="
                                                                        vertical-align: inherit;
                                                                      "
                                                                      ><font
                                                                        style="
                                                                          vertical-align: inherit;
                                                                        "
                                                                        ><font
                                                                          style="
                                                                            vertical-align: inherit;
                                                                          "
                                                                          ><font
                                                                            style="
                                                                              vertical-align: inherit;
                                                                            "
                                                                            ><font
                                                                              style="
                                                                                vertical-align: inherit;
                                                                              "
                                                                              ><font
                                                                                style="
                                                                                  vertical-align: inherit;
                                                                                "
                                                                                ><font
                                                                                  style="
                                                                                    vertical-align: inherit;
                                                                                  "
                                                                                  ><font
                                                                                    style="
                                                                                      vertical-align: inherit;
                                                                                    "
                                                                                    ><font
                                                                                      style="
                                                                                        vertical-align: inherit;
                                                                                      "
                                                                                      >Hola${" "}${nombre}</font
                                                                                    ></font
                                                                                  ></font
                                                                                ></font
                                                                              ></font
                                                                            ></font
                                                                          ></font
                                                                        ></font
                                                                      ></font
                                                                    ></font
                                                                  ></strong
                                                                ></font
                                                              ></font
                                                            ></font
                                                          ></font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></font
                                        >
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: helvetica, 'helvetica neue',
                                            arial, verdana, sans-serif;
                                          line-height: 21px;
                                          color: #02604d;
                                          font-size: 14px;
                                        "
                                      >
                                        <br /><font
                                          style="vertical-align: inherit"
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          ><font
                                                            style="
                                                              vertical-align: inherit;
                                                            "
                                                            ><font
                                                              style="
                                                                vertical-align: inherit;
                                                              "
                                                              ><font
                                                                style="
                                                                  vertical-align: inherit;
                                                                "
                                                                ><font
                                                                  style="
                                                                    vertical-align: inherit;
                                                                  "
                                                                  ><font
                                                                    style="
                                                                      vertical-align: inherit;
                                                                    "
                                                                    ><font
                                                                      style="
                                                                        vertical-align: inherit;
                                                                      "
                                                                      ><font
                                                                        style="
                                                                          vertical-align: inherit;
                                                                        "
                                                                        ><font
                                                                          style="
                                                                            vertical-align: inherit;
                                                                          "
                                                                          ><font
                                                                            style="
                                                                              vertical-align: inherit;
                                                                            "
                                                                            ><font
                                                                              style="
                                                                                vertical-align: inherit;
                                                                              "
                                                                              ><font
                                                                                style="
                                                                                  vertical-align: inherit;
                                                                                "
                                                                                ><font
                                                                                  style="
                                                                                    vertical-align: inherit;
                                                                                  "
                                                                                  ><font
                                                                                    style="
                                                                                      vertical-align: inherit;
                                                                                    "
                                                                                  >
                                                                                    Has
                                                                                    solicitado
                                                                                    un
                                                                                    nuevo
                                                                                    cambio
                                                                                    de
                                                                                    contraseña,
                                                                                    por
                                                                                    favor
                                                                                    ingresa
                                                                                    el
                                                                                    código
                                                                                    de
                                                                                    abajo
                                                                                    en
                                                                                    la
                                                                                    Plataforma
                                                                                    de
                                                                                    EcoPlastic
                                                                                    para
                                                                                    continuar
                                                                                    con
                                                                                    tu
                                                                                    proceso
                                                                                    de
                                                                                    recuperación
                                                                                    de
                                                                                    contraseña.
                                                                                  </font></font
                                                                                ></font
                                                                              ></font
                                                                            ></font
                                                                          ></font
                                                                        ></font
                                                                      ></font
                                                                    ></font
                                                                  ></font
                                                                ></font
                                                              ></font
                                                            ></font
                                                          ><font
                                                            style="
                                                              vertical-align: inherit;
                                                            "
                                                            ><font
                                                              style="
                                                                vertical-align: inherit;
                                                              "
                                                              ><font
                                                                style="
                                                                  vertical-align: inherit;
                                                                "
                                                                ><font
                                                                  style="
                                                                    vertical-align: inherit;
                                                                  "
                                                                  ><font
                                                                    style="
                                                                      vertical-align: inherit;
                                                                    "
                                                                    ><font
                                                                      style="
                                                                        vertical-align: inherit;
                                                                      "
                                                                      ><font
                                                                        style="
                                                                          vertical-align: inherit;
                                                                        "
                                                                        ><font
                                                                          style="
                                                                            vertical-align: inherit;
                                                                          "
                                                                          ><font
                                                                            style="
                                                                              vertical-align: inherit;
                                                                            "
                                                                            ><font
                                                                              style="
                                                                                vertical-align: inherit;
                                                                              "
                                                                              ><font
                                                                                style="
                                                                                  vertical-align: inherit;
                                                                                "
                                                                                ><font
                                                                                  style="
                                                                                    vertical-align: inherit;
                                                                                  "
                                                                                >
                                                                                  <br />
                                                                                  <br />
                                                                                  <font
                                                                                    style="
                                                                                      vertical-align: inherit;
                                                                                      font-size: 20px;
                                                                                    "
                                                                                    >El
                                                                                    codigo
                                                                                    de
                                                                                    verificacion
                                                                                    es:</font
                                                                                  ></font
                                                                                ></font
                                                                              ></font
                                                                            ></font
                                                                          ></font
                                                                        ></font
                                                                      ></font
                                                                    ></font
                                                                  ></font
                                                                ></font
                                                              ></font
                                                            ></font
                                                          ></font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></font
                                        >
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-bottom: 35px;
                                      "
                                    >
                                      <!--[if mso
                                        ]><a href="" target="_blank" hidden>
                                          <v:roundrect
                                            xmlns:v="urn:schemas-microsoft-com:vml"
                                            xmlns:w="urn:schemas-microsoft-com:office:word"
                                            esdevVmlButton
                                            href=""
                                            style="
                                              height: 44px;
                                              v-text-anchor: middle;
                                              width: 127px;
                                            "
                                            arcsize="34%"
                                            stroke="f"
                                            fillcolor="#02604d"
                                          >
                                            <w:anchorlock></w:anchorlock>
                                            <center
                                              style="
                                                color: #f6f3eb;
                                                font-family: helvetica,
                                                  'helvetica neue', arial, verdana,
                                                  sans-serif;
                                                font-size: 18px;
                                                font-weight: 700;
                                                line-height: 18px;
                                                mso-text-raise: 1px;
                                              "
                                            >
                                              ${codigo}
                                            </center>
                                          </v:roundrect></a
                                        > <!
                                      [endif]--><!--[if !mso]><!-- --><span
                                        class="msohide es-button-border"
                                        style="
                                          border-style: solid;
                                          border-color: #2cb543;
                                          background: #02604d;
                                          border-width: 0px;
                                          display: inline-block;
                                          border-radius: 15px;
                                          width: auto;
                                          mso-hide: all;
                                        "
                                        ><a
                                          href=""
                                          class="es-button"
                                          target="_blank"
                                          style="
                                            mso-style-priority: 100 !important;
                                            text-decoration: none;
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            color: #f6f3eb;
                                            font-size: 20px;
                                            border-style: solid;
                                            border-color: #02604d;
                                            border-width: 10px 30px 10px 30px;
                                            display: inline-block;
                                            background: #02604d;
                                            border-radius: 15px;
                                            font-family: helvetica,
                                              'helvetica neue', arial, verdana,
                                              sans-serif;
                                            font-weight: bold;
                                            font-style: normal;
                                            line-height: 24px;
                                            width: auto;
                                            text-align: center;
                                          "
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      >${codigo}</font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></a
                                        ></span
                                      ><!--<![endif]-->
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="left"
                                      style="padding: 0; margin: 0"
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: helvetica, 'helvetica neue',
                                            arial, verdana, sans-serif;
                                          line-height: 21px;
                                          color: #02604d;
                                          font-size: 14px;
                                        "
                                      >
                                        <font style="vertical-align: inherit"
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    >Usa el siguiente código para
                                                    iniciar sesión y sigue los
                                                    pasos para cambiar la
                                                    contraseña</font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></font
                                        >
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="left"
                                      style="padding: 0; margin: 0"
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: helvetica, 'helvetica neue',
                                            arial, verdana, sans-serif;
                                          line-height: 21px;
                                          color: #02604d;
                                          font-size: 14px;
                                        "
                                      >
                                        <br /><font
                                          style="vertical-align: inherit"
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          ><font
                                                            style="
                                                              vertical-align: inherit;
                                                            "
                                                            ><font
                                                              style="
                                                                vertical-align: inherit;
                                                              "
                                                              ><font
                                                                style="
                                                                  vertical-align: inherit;
                                                                "
                                                                ><font
                                                                  style="
                                                                    vertical-align: inherit;
                                                                  "
                                                                  ><font
                                                                    style="
                                                                      vertical-align: inherit;
                                                                    "
                                                                    ><font
                                                                      style="
                                                                        vertical-align: inherit;
                                                                      "
                                                                      ><font
                                                                        style="
                                                                          vertical-align: inherit;
                                                                        "
                                                                        ><font
                                                                          style="
                                                                            vertical-align: inherit;
                                                                          "
                                                                          ><font
                                                                            style="
                                                                              vertical-align: inherit;
                                                                            "
                                                                            ><font
                                                                              style="
                                                                                vertical-align: inherit;
                                                                              "
                                                                              ><font
                                                                                style="
                                                                                  vertical-align: inherit;
                                                                                "
                                                                                ><font
                                                                                  style="
                                                                                    vertical-align: inherit;
                                                                                  "
                                                                                  ><font
                                                                                    style="
                                                                                      vertical-align: inherit;
                                                                                    "
                                                                                    >Si
                                                                                    no
                                                                                    solicitaste
                                                                                    este
                                                                                    código,
                                                                                    es
                                                                                    posible
                                                                                    que
                                                                                    alguien
                                                                                    esté
                                                                                    tratando
                                                                                    de
                                                                                    acceder
                                                                                    a
                                                                                    tu
                                                                                    cuenta.
                                                                                  </font></font
                                                                                ></font
                                                                              ></font
                                                                            ></font
                                                                          ></font
                                                                        ></font
                                                                      ></font
                                                                    ></font
                                                                  ></font
                                                                ></font
                                                              ></font
                                                            ></font
                                                          ></font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></font
                                        ><br /><strong
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          ><font
                                                            style="
                                                              vertical-align: inherit;
                                                            "
                                                            ><font
                                                              style="
                                                                vertical-align: inherit;
                                                              "
                                                              ><font
                                                                style="
                                                                  vertical-align: inherit;
                                                                "
                                                                ><font
                                                                  style="
                                                                    vertical-align: inherit;
                                                                  "
                                                                  ><font
                                                                    style="
                                                                      vertical-align: inherit;
                                                                    "
                                                                    ><font
                                                                      style="
                                                                        vertical-align: inherit;
                                                                      "
                                                                      ><font
                                                                        style="
                                                                          vertical-align: inherit;
                                                                        "
                                                                        ><font
                                                                          style="
                                                                            vertical-align: inherit;
                                                                          "
                                                                          ><font
                                                                            style="
                                                                              vertical-align: inherit;
                                                                            "
                                                                            ><font
                                                                              style="
                                                                                vertical-align: inherit;
                                                                              "
                                                                              ><font
                                                                                style="
                                                                                  vertical-align: inherit;
                                                                                "
                                                                                ><font
                                                                                  style="
                                                                                    vertical-align: inherit;
                                                                                  "
                                                                                  ><font
                                                                                    style="
                                                                                      vertical-align: inherit;
                                                                                    "
                                                                                    ><font
                                                                                      style="
                                                                                        vertical-align: inherit;
                                                                                      "
                                                                                      >No
                                                                                      reenvíes
                                                                                      este
                                                                                      código
                                                                                      a
                                                                                      otra
                                                                                      persona.</font
                                                                                    ></font
                                                                                  ></font
                                                                                ></font
                                                                              ></font
                                                                            ></font
                                                                          ></font
                                                                        ></font
                                                                      ></font
                                                                    ></font
                                                                  ></font
                                                                ></font
                                                              ></font
                                                            ></font
                                                          ></font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></strong
                                        >
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="center"
                                valign="top"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="padding: 0; margin: 0; display: none"
                                    ></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="padding: 0; margin: 0">
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="center"
                                valign="top"
                                style="padding: 0; margin: 0; width: 600px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        font-size: 0px;
                                      "
                                    >
                                      <a
                                        target="_blank"
                                        href=""
                                        style="
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          text-decoration: underline;
                                          color: #02604d;
                                          font-size: 14px;
                                        "
                                        ><img
                                          class="adapt-img"
                                          src="https://aiijci.stripocdn.email/content/guids/CABINET_f4f8be13dd07ed085a349f5fd969d18a/images/group_34_QzO.png"
                                          alt
                                          style="
                                            display: block;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                            -ms-interpolation-mode: bicubic;
                                          "
                                          width="600"
                                      /></a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table
                cellpadding="0"
                cellspacing="0"
                class="es-footer"
                align="center"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  table-layout: fixed !important;
                  width: 100%;
                  background-color: transparent;
                  background-repeat: repeat;
                  background-position: center top;
                "
              >
                <tr>
                  <td align="center" style="padding: 0; margin: 0">
                    <table
                      bgcolor="#ffffff"
                      class="es-footer-body"
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse;
                        border-spacing: 0px;
                        background-color: transparent;
                        width: 600px;
                      "
                    >
                      <tr>
                        <td
                          align="left"
                          style="
                            margin: 0;
                            padding-top: 20px;
                            padding-bottom: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="left"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td style="padding: 0; margin: 0">
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        width="100%"
                                        class="es-menu"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tr class="links">
                                          <td
                                            align="center"
                                            valign="top"
                                            width="25%"
                                            style="
                                              margin: 0;
                                              padding-left: 5px;
                                              padding-right: 5px;
                                              padding-top: 10px;
                                              padding-bottom: 10px;
                                              border: 0;
                                            "
                                            id="esd-menu-id-0"
                                          >
                                            <a
                                              target="_blank"
                                              href=""
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: none;
                                                display: block;
                                                font-family: helvetica,
                                                  'helvetica neue', arial, verdana,
                                                  sans-serif;
                                                color: #666666;
                                                font-size: 12px;
                                                font-weight: normal;
                                              "
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          >SOBRE NOSOTROS</font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></a
                                            >
                                          </td>
                                          <td
                                            align="center"
                                            valign="top"
                                            width="25%"
                                            style="
                                              margin: 0;
                                              padding-left: 5px;
                                              padding-right: 5px;
                                              padding-top: 10px;
                                              padding-bottom: 10px;
                                              border: 0;
                                              border-left: 1px solid #999999;
                                            "
                                            id="esd-menu-id-1"
                                          >
                                            <a
                                              target="_blank"
                                              href=""
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: none;
                                                display: block;
                                                font-family: helvetica,
                                                  'helvetica neue', arial, verdana,
                                                  sans-serif;
                                                color: #666666;
                                                font-size: 12px;
                                                font-weight: normal;
                                              "
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          >NOTICIAS</font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></a
                                            >
                                          </td>
                                          <td
                                            align="center"
                                            valign="top"
                                            width="25%"
                                            style="
                                              margin: 0;
                                              padding-left: 5px;
                                              padding-right: 5px;
                                              padding-top: 10px;
                                              padding-bottom: 10px;
                                              border: 0;
                                              border-left: 1px solid #999999;
                                            "
                                            id="esd-menu-id-2"
                                          >
                                            <a
                                              target="_blank"
                                              href=""
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: none;
                                                display: block;
                                                font-family: helvetica,
                                                  'helvetica neue', arial, verdana,
                                                  sans-serif;
                                                color: #666666;
                                                font-size: 12px;
                                                font-weight: normal;
                                              "
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          >CARRERA
                                                          PROFESIONAL</font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></a
                                            >
                                          </td>
                                          <td
                                            align="center"
                                            valign="top"
                                            width="25%"
                                            style="
                                              margin: 0;
                                              padding-left: 5px;
                                              padding-right: 5px;
                                              padding-top: 10px;
                                              padding-bottom: 10px;
                                              border: 0;
                                              border-left: 1px solid #999999;
                                            "
                                            id="esd-menu-id-3"
                                          >
                                            <a
                                              target="_blank"
                                              href=""
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: none;
                                                display: block;
                                                font-family: helvetica,
                                                  'helvetica neue', arial, verdana,
                                                  sans-serif;
                                                color: #666666;
                                                font-size: 12px;
                                                font-weight: normal;
                                              "
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      ><font
                                                        style="
                                                          vertical-align: inherit;
                                                        "
                                                        ><font
                                                          style="
                                                            vertical-align: inherit;
                                                          "
                                                          >LAS TIENDAS</font
                                                        ></font
                                                      ></font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></a
                                            >
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-top: 10px;
                                        padding-bottom: 10px;
                                        font-size: 0;
                                      "
                                    >
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="es-table-not-adapt es-social"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tr>
                                          <td
                                            align="center"
                                            valign="top"
                                            style="
                                              padding: 0;
                                              margin: 0;
                                              padding-right: 20px;
                                            "
                                          >
                                            <a
                                              target="_blank"
                                              href=""
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: underline;
                                                color: #666666;
                                                font-size: 12px;
                                              "
                                              ><img
                                                title="Facebook"
                                                src="https://aiijci.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png"
                                                alt="Pensión completa"
                                                width="24"
                                                height="24"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                "
                                            /></a>
                                          </td>
                                          <td
                                            align="center"
                                            valign="top"
                                            style="
                                              padding: 0;
                                              margin: 0;
                                              padding-right: 20px;
                                            "
                                          >
                                            <a
                                              target="_blank"
                                              href=""
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: underline;
                                                color: #666666;
                                                font-size: 12px;
                                              "
                                              ><img
                                                title="Gorjeo"
                                                src="https://aiijci.stripocdn.email/content/assets/img/social-icons/logo-colored/twitter-logo-colored.png"
                                                alt="dos"
                                                width="24"
                                                height="24"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                "
                                            /></a>
                                          </td>
                                          <td
                                            align="center"
                                            valign="top"
                                            style="
                                              padding: 0;
                                              margin: 0;
                                              padding-right: 20px;
                                            "
                                          >
                                            <a
                                              target="_blank"
                                              href=""
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: underline;
                                                color: #666666;
                                                font-size: 12px;
                                              "
                                              ><img
                                                title="Instagram"
                                                src="https://aiijci.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png"
                                                alt="Inst"
                                                width="24"
                                                height="24"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                "
                                            /></a>
                                          </td>
                                          <td
                                            align="center"
                                            valign="top"
                                            style="padding: 0; margin: 0"
                                          >
                                            <a
                                              target="_blank"
                                              href=""
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: underline;
                                                color: #666666;
                                                font-size: 12px;
                                              "
                                              ><img
                                                title="YouTube"
                                                src="https://aiijci.stripocdn.email/content/assets/img/social-icons/logo-colored/youtube-logo-colored.png"
                                                alt="Yt"
                                                width="24"
                                                height="24"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
                                                "
                                            /></a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-top: 10px;
                                        padding-bottom: 10px;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: helvetica, 'helvetica neue',
                                            arial, verdana, sans-serif;
                                          line-height: 18px;
                                          color: #666666;
                                          font-size: 12px;
                                        "
                                      >
                                        <font style="vertical-align: inherit"
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    >Está recibiendo este correo
                                                    electrónico porque ha visitado
                                                    nuestro sitio o nos ha
                                                    preguntado sobre el boletín
                                                    periódico.
                                                  </font></font
                                                ></font
                                              ></font
                                            ></font
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    >Asegúrese de que nuestros
                                                    mensajes lleguen a su Bandeja
                                                    de entrada (y no a sus
                                                    carpetas masivas o basura).
                                                  </font></font
                                                ></font
                                              ></font
                                            ></font
                                          ></font
                                        ><br /><a
                                          target="_blank"
                                          href=""
                                          style="
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            text-decoration: none;
                                            color: #666666;
                                            font-size: 12px;
                                          "
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      >Politica de
                                                      privacidad</font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></a
                                        ><font style="vertical-align: inherit"
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                  >
                                                    |
                                                  </font></font
                                                ></font
                                              ></font
                                            ></font
                                          ></font
                                        ><a
                                          target="_blank"
                                          style="
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            text-decoration: none;
                                            color: #666666;
                                            font-size: 12px;
                                          "
                                          href=""
                                          ><font style="vertical-align: inherit"
                                            ><font style="vertical-align: inherit"
                                              ><font
                                                style="vertical-align: inherit"
                                                ><font
                                                  style="vertical-align: inherit"
                                                  ><font
                                                    style="
                                                      vertical-align: inherit;
                                                    "
                                                    ><font
                                                      style="
                                                        vertical-align: inherit;
                                                      "
                                                      >Darse de baja</font
                                                    ></font
                                                  ></font
                                                ></font
                                              ></font
                                            ></font
                                          ></a
                                        >
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  
  `;
};

export default templateEmailPassRecovery;
