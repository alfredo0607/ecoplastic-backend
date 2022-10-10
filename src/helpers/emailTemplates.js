const templateEmailPassRecovery = (cedula, codigo, email) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Notificación | Seguridad Penta LTDA.</title>
      <style type="text/css">
    
      #outlook a {padding:0;}
        body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
        .ExternalClass {width:100%;}
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
        #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}
        img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
        a img {border:none;}
        .image_fix {display:block;}
        p {margin: 1em 0;}
        h1, h2, h3, h4, h5, h6 {color: black !important;}
    
        h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: blue !important;}
    
        h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {
          color: red !important; 
        }
    
        h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {
          color: purple !important; 
        }
    
        table td {border-collapse: collapse;}
    
        table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    
        a {color: #000;}
    
        @media only screen and (max-device-width: 480px) {
    
          a[href^="tel"], a[href^="sms"] {
                text-decoration: none;
                color: black; /* or whatever your want */
                pointer-events: none;
                cursor: default;
              }
    
          .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
                text-decoration: default;
                color: orange !important; /* or whatever your want */
                pointer-events: auto;
                cursor: default;
              }
        }
    
    
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
          a[href^="tel"], a[href^="sms"] {
                text-decoration: none;
                color: blue; /* or whatever your want */
                pointer-events: none;
                cursor: default;
              }
    
          .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
                text-decoration: default;
                color: orange !important;
                pointer-events: auto;
                cursor: default;
              }
        }
    
        @media only screen and (-webkit-min-device-pixel-ratio: 2) {
          /* Put your iPhone 4g styles in here */
        }
    
        @media only screen and (-webkit-device-pixel-ratio:.75){
          /* Put CSS for low density (ldpi) Android layouts in here */
        }
        @media only screen and (-webkit-device-pixel-ratio:1){
          /* Put CSS for medium density (mdpi) Android layouts in here */
        }
        @media only screen and (-webkit-device-pixel-ratio:1.5){
          /* Put CSS for high density (hdpi) Android layouts in here */
        }
        /* end Android targeting */
    .bgBody{
      background: lightgrey;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .bgItem{
      background: #ffffff;
    }
    h2{
    color:#181818;
    font-family:Helvetica, Arial, sans-serif;
    font-size:22px;
    font-weight: normal;
    }
    p{
      color:#555;
      font-family:Helvetica, Arial, sans-serif;
      font-size:16px;
      line-height:160%;
    }
    
    </style>
    
        <script type="colorScheme" class="swatch active">
          {
            "name":"Default",
            "bgBody":"ffffff",
            "link":"000000",
            "color":"555555",
            "bgItem":"ffffff",
            "title":"181818"
          }
        </script>
    
    </head>
    <body>
      <!-- Wrapper/Container Table: Use a wrapper table to control the width and the background color consistently of your email. Use this approach instead of setting attributes on the body tag. -->
      <table cellpadding="0" width="100%" cellspacing="0" border="0" id="backgroundTable" class='bgBody'>
      <tr>
        <td>
    
        <!-- Tables are the most common way to format your email consistently. Set your table widths inside cells and in most cases reset cellpadding, cellspacing, and border to zero. Use nested tables as a way to space effectively in your message. -->
        
    
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600" class='bgItem' style="margin: 20px auto;">
          <tr>
            <td class='movableContentContainer' style="background-color: ghostwhite;">
            
    
            <div class='movableContent'>
              <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
                <tr height="20">
                  <td width="200">&nbsp;</td>
                  <td width="200">&nbsp;</td>
                  <td width="200">&nbsp;</td>
                </tr>
                <tr>
                  <td width="100%" valign="top" align="center">
                    <div class="contentEditableContainer contentImageEditable" >
                                  <div class="contentEditable" >
                                    <img src="https://seguridadpenta.com/assets/images/logoColor.png" width="60%" height="100"  data-default="placeholder" alt='Logo Seguridad Penta LTDA.'/>
                                  </div>
                              </div>
                  </td>
                </tr>
                <tr height="15">
                  <td width="200">&nbsp;</td>
                  <td width="200">&nbsp;</td>
                  <td width="200">&nbsp;</td>
                </tr>
              </table>
            </div>
    
                    <hr style="height:1px;border:none;color:#333;background-color:#ddd; width: 80%;">
    
            <div class='movableContent'>
              <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
                <tr>
                  <td width="50">&nbsp;</td>
                  <td width="500" colspan="3" align="center">
                    <div class="contentEditableContainer contentTextEditable" >
                                  <div class="contentEditable" >
                                    <h2 style="margin-bottom: 15px;">RECUPERACION DE CONTRASEÑA</h2>
                                  </div>
                              </div>
                  </td>
                  <td width="50">&nbsp;</td>
                </tr>
              </table>
            </div>
    
                    <hr style="height:1px;border:none;color:#333;background-color:#ddd; width: 80%;">
    
            <div class='movableContent'>
              <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
                <tr>
                  <td width="50">&nbsp;</td>
                  <td width="500" align="left" style="padding-bottom:15px;">
                    <div class="contentEditableContainer contentTextEditable">
                                  <div class="contentEditable" >
                                      <p>
                                                Has solicitado un nuevo cambio de contraseña, por favor ingresa el código de abajo en la Plataforma Empresarial
                                                para continuar con tu proceso de recuperación de contraseña. <br /><br />
    
                                                -----------------------------------------<br />
                                                <strong>N° Cédula: </a></strong>${cedula}<br />
                                                <strong>Código: </a></strong>${codigo}<br />
                                                -----------------------------------------<br />
                        </p>
                                  </div>
                              </div>
                  </td>
                  <td width="50">&nbsp;</td>
                </tr>
              </table>
            </div>		
            
            <div class='movableContent'>				
              <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
                <tr>
                  <td width="100%" colspan="2" style="padding-top:50px;">
                    <hr style="height:1px;border:none;color:#333;background-color:#ddd;" />
                  </td>
                </tr>
                <tr>
                  <td width="60%" height="70" valign="middle" style="padding-bottom:20px;">
                  <div class="contentEditableContainer contentTextEditable">
                    <div class="contentEditable" >
                      <span style="font-size:13px;color:#181818;font-family:Helvetica, Arial, sans-serif;line-height:200%; margin-left: 20px;">Enviado a ${email}</span>
                                        <br/>
                      <span style="font-size:11px;color:#555;font-family:Helvetica, Arial, sans-serif;line-height:200%; margin-left: 20px;">Carrera 75 # 25f - 13 Bogotá, Colombia. | +57 1 410 4617</span>
                      <br/>
                      <span style="font-size:11px;color:#555;font-family:Helvetica, Arial, sans-serif;line-height:200%; margin-left: 20px;">Copyright © 2020 | Seguridad Penta LTDA.</span>
                      <br/>
                    </div>
                  </div>
                    
                  </td>
                  <td width="40%" height="70" align="right" valign="top" align='right' style="padding-bottom:20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align='right'>
                      <tr>
                        <td width='84%'></td>
                        <td valign="top" width='34'>
                          <div class="contentEditableContainer contentFacebookEditable" style='display:inline;'>
                                        <div class="contentEditable" >
                                                        <a target="_blank" href="https://facebook.com/Seguridad-Penta-1456026974704480/">
                                                            <img src="https://seguridadpenta.com/assets/images/facebook.png" data-default="placeholder" data-max-width="30" width='30' height='30' alt='facebook' style='margin-right:5px;' data-customIcon="true" >
                                                        </a>
                                        </div>
                                    </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
    
    
            </td>
          </tr>
        </table>
    
        
    
        </td>
      </tr>
      </table>
      <!-- End of wrapper table -->
    
    </body>
    </html>
  `;
};

export default templateEmailPassRecovery;
