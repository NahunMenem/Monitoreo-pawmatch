# Instalar el Admin Router — instrucciones exactas

## Paso 1 — Copiar el router

En tu repo `PETMATCH-BACK`, copiá `admin_router.py` a:

```
app/routers/admin_router.py
```

## Paso 2 — Registrarlo en main.py

Abrí `app/main.py` y hacé exactamente dos cambios:

### 2a. Agregar el import (línea ~9, luego del último import de routers)

```python
from .routers import (
    auth_router,
    pets_router,
    chat_router,
    adoption_router,
    upload_router,
    notifications_router,
    dev_router,
    patitas_router,
    lost_pets_router,
    admin_router,       # ← AGREGAR ESTA LÍNEA
)
```

### 2b. Registrar el router (línea ~45, luego del último app.include_router)

```python
app.include_router(lost_pets_router.router)
app.include_router(admin_router.router)    # ← AGREGAR ESTA LÍNEA
```

## Paso 3 — Push a GitHub

```bash
git add app/routers/admin_router.py app/main.py
git commit -m "Add admin router for monitoring center"
git push
```

Railway re-deploya automáticamente en ~1-2 min.

## Paso 4 — Verificar

```bash
curl https://petmatch-back-production.up.railway.app/admin/stats \
  -H "Authorization: Bearer TU_TOKEN_DE_NAHUNDEVELOPER"
```

Debe devolver JSON con stats. Sin el token (o con otro usuario) devuelve 403.

## Endpoints disponibles

| Método | Endpoint                         | Descripción                    |
|--------|----------------------------------|--------------------------------|
| GET    | /admin/stats                     | Métricas generales             |
| GET    | /admin/stats/growth              | Crecimiento 8 semanas          |
| GET    | /admin/users                     | Listar usuarios con métricas   |
| POST   | /admin/users/{id}/patitas        | Asignar Patitas manualmente    |
| DELETE | /admin/users/{id}                | Eliminar usuario y mascotas    |
| GET    | /admin/patitas/packs             | Listar packs (con is_active)   |
| PUT    | /admin/patitas/packs/{id}        | Actualizar precio/patitas      |

Todos requieren token del usuario `nahundeveloper@gmail.com`.
