import { useEffect, useRef } from 'react'

const STATUS_COLORS = {
  'Off Duty': '#4B5563',
  'Sleeper Berth': '#6B7280',
  'Driving': '#3B82F6',
  'On Duty': '#10B981'
}

const STATUS_ROWS = {
  'Off Duty': 0,
  'Sleeper Berth': 1,
  'Driving': 2,
  'On Duty': 3
}

function ELDLogCanvas({ dayData, tripPlan }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !dayData) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const width = 1200
    const height = 400
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    // Draw header
    drawHeader(ctx, dayData, tripPlan, width)

    // Draw grid
    const gridTop = 100
    const gridHeight = 240
    const gridWidth = width - 100
    drawGrid(ctx, 50, gridTop, gridWidth, gridHeight)

    // Draw events
    drawEvents(ctx, dayData.events, 50, gridTop, gridWidth, gridHeight)

    // Draw footer
    drawFooter(ctx, dayData.events, 50, gridTop + gridHeight + 10, width)

  }, [dayData, tripPlan])

  const drawHeader = (ctx, dayData, tripPlan, width) => {
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(`ELD Daily Log - Day ${dayData.day}`, width / 2 - 100, 25)
    
    ctx.font = '12px Arial'
    ctx.fillText(`Date: ${dayData.date}`, 50, 50)
    ctx.fillText(`Driver: ${tripPlan.driver_name || 'N/A'}`, 250, 50)
    ctx.fillText(`Carrier: ${tripPlan.carrier_name || 'N/A'}`, 450, 50)
    ctx.fillText(`Truck: ${tripPlan.truck_number || 'N/A'}`, 650, 50)
    
    const totalMiles = calculateDailyMiles(dayData.events)
    ctx.fillText(`Total Miles: ${totalMiles.toFixed(1)}`, 850, 50)
  }

  const drawGrid = (ctx, x, y, width, height) => {
    const rowHeight = height / 4
    
    // Draw horizontal lines and labels
    const labels = ['Off Duty', 'Sleeper Berth', 'Driving', 'On Duty']
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    
    for (let i = 0; i <= 4; i++) {
      const yPos = y + i * rowHeight
      ctx.beginPath()
      ctx.moveTo(x, yPos)
      ctx.lineTo(x + width, yPos)
      ctx.stroke()
      
      if (i < 4) {
        ctx.fillStyle = '#000000'
        ctx.font = '10px Arial'
        ctx.save()
        ctx.translate(x - 10, yPos + rowHeight / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.textAlign = 'center'
        ctx.fillText(labels[i], 0, 0)
        ctx.restore()
      }
    }
    
    // Draw vertical lines (hours)
    ctx.strokeStyle = '#CCCCCC'
    for (let hour = 0; hour <= 24; hour++) {
      const xPos = x + (hour / 24) * width
      ctx.beginPath()
      ctx.moveTo(xPos, y)
      ctx.lineTo(xPos, y + height)
      ctx.stroke()
      
      // Hour labels
      ctx.fillStyle = '#000000'
      ctx.font = '9px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(hour.toString().padStart(2, '0'), xPos, y - 5)
    }
  }

  const drawEvents = (ctx, events, x, y, width, height) => {
    const rowHeight = height / 4
    
    events.forEach((event, index) => {
      const row = STATUS_ROWS[event.status]
      const startMinutes = timeToMinutes(event.start)
      const endMinutes = timeToMinutes(event.end)
      
      const startX = x + (startMinutes / 1440) * width
      const endX = x + (endMinutes / 1440) * width
      const yPos = y + row * rowHeight
      
      // Draw filled rectangle
      ctx.fillStyle = STATUS_COLORS[event.status]
      ctx.fillRect(startX, yPos + 2, endX - startX, rowHeight - 4)
      
      // Draw connecting line to next event if status changes
      if (index < events.length - 1) {
        const nextRow = STATUS_ROWS[events[index + 1].status]
        if (nextRow !== row) {
          ctx.strokeStyle = STATUS_COLORS[event.status]
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(endX, yPos + rowHeight / 2)
          ctx.lineTo(endX, y + nextRow * rowHeight + rowHeight / 2)
          ctx.stroke()
        }
      }
    })
  }

  const drawFooter = (ctx, events, x, y, width) => {
    const totals = calculateTotals(events)
    
    ctx.fillStyle = '#000000'
    ctx.font = '11px Arial'
    ctx.fillText('Totals:', x, y)
    ctx.fillText(`Off Duty: ${totals['Off Duty'].toFixed(1)}h`, x + 100, y)
    ctx.fillText(`Sleeper: ${totals['Sleeper Berth'].toFixed(1)}h`, x + 250, y)
    ctx.fillText(`Driving: ${totals['Driving'].toFixed(1)}h`, x + 400, y)
    ctx.fillText(`On Duty: ${totals['On Duty'].toFixed(1)}h`, x + 550, y)
  }

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  const calculateTotals = (events) => {
    const totals = {
      'Off Duty': 0,
      'Sleeper Berth': 0,
      'Driving': 0,
      'On Duty': 0
    }
    
    events.forEach(event => {
      totals[event.status] += event.duration || 0
    })
    
    return totals
  }

  const calculateDailyMiles = (events) => {
    return events
      .filter(e => e.status === 'Driving')
      .reduce((sum, e) => sum + (e.duration * 55), 0) // Assume 55 mph average
  }

  const handlePrint = () => {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>ELD Log - Day ${dayData.day}</title>
          <style>
            body { margin: 0; padding: 20px; }
            img { max-width: 100%; height: auto; }
            @media print {
              body { margin: 0; }
              img { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 dark:border-gray-600 rounded-lg w-full"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        Print/Download Log
      </button>
    </div>
  )
}

export default ELDLogCanvas
