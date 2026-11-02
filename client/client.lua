RegisterCommand('calculator', function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open'
    })
end)

RegisterNUICallback('close', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)