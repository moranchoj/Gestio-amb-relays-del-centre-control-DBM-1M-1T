# Configuració d'Email - Instruccions

Per habilitar les notificacions per email, seguiu aquests passos:

## 1. Crear Contrasenya d'Aplicació de Gmail

1. Aneu a [myaccount.google.com](https://myaccount.google.com)
2. Seleccioneu **Seguretat**
3. A "Accés a Google", seleccioneu **Verificació en 2 passos**
4. A la part inferior, seleccioneu **Contrasenyes d'aplicació**
5. Seleccioneu l'aplicació i el dispositiu per als quals voleu generar la contrasenya
6. Seguiu les instruccions per generar la contrasenya d'aplicació
7. Utilitzeu aquesta contrasenya (no la vostra contrasenya normal de Gmail)

## 2. Configurar al Dashboard

1. Accediu al dashboard: `http://[IP_RASPBERRY]:1880/ui`
2. Aneu a la pestanya **Configuració**
3. Introduïu la vostra configuració d'email:
   - **Gmail User**: el vostre email complet (exemple@gmail.com)
   - **Gmail Password**: la contrasenya d'aplicació generada
   - **Recipient**: email de destinatari
   - **Subject**: assumpte del correu (per defecte: "Informe maniobra bomba DBM")

## 3. Habilitar Emails

Marqueu la casella **Habilitar emails** i deseu la configuració.

## 4. Alternativa: Configuració Manual

Podeu editar directament el fitxer `config-parametres-logica.json`:

```json
{
  "email": {
    "enabled": true,
    "gmail_user": "el_vostre_email@gmail.com",
    "gmail_password": "la_vostra_contrasenya_app",
    "recipient": "destinatari@email.com",
    "subject": "Informe maniobra bomba DBM"
  }
}
```

## Exemple de Correu Rebut

```
Assumpte: Informe maniobra bomba DBM - 05/08/2024

Informe de maniobra de bomba DBM:

Hora d'inici: 05/08/2024, 12:00:15
Durada: 156 segons
Nivell inicial dipòsit A: 25%
Nivell inicial dipòsit B: 35%
Nivell final dipòsit A: 22%
Nivell final dipòsit B: 95%
Motiu de finalització: Dipòsit B ha arribat al màxim (95%)
Estat: completada
```

## Troubleshooting

### Error "Authentication failed"
- Verificar que utilitzeu una contrasenya d'aplicació, no la contrasenya normal
- Comprovar que el vostre compte té la verificació en 2 passos activada

### Error "SMTP connection failed"
- Verificar la connexió a internet
- Comprovar que Gmail no està bloquejant l'aplicació

### No rebeu emails
- Revisar la carpeta de spam
- Verificar que l'adreça de destinatari és correcta
- Comprovar els logs de Node-RED per errors específics