import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface PincodeRecord {
  name: string
  district: string
  state: string
}

// In-memory cache map of Pincode -> Array of records
let cachedMap: Record<string, PincodeRecord[]> | null = null

function loadPincodes(): Record<string, PincodeRecord[]> {
  // Check if cache already exists on module-level or global level (dev server re-evaluation)
  const globalRef = global as any
  if (globalRef.__pincodeCache) {
    return globalRef.__pincodeCache
  }
  if (cachedMap) {
    return cachedMap
  }

  const csvPath = path.join(process.cwd(), 'public/data/pincodes.csv')
  if (!fs.existsSync(csvPath)) {
    console.error(`Pincodes CSV not found at: ${csvPath}`)
    return {}
  }

  const startTime = Date.now()
  console.log('Parsing pincodes.csv...')

  try {
    const fileContent = fs.readFileSync(csvPath, 'utf8')
    const lines = fileContent.split('\n')
    const map: Record<string, PincodeRecord[]> = {}

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const parts = line.split(',')
      if (parts.length < 4) continue

      const pincode = parts[0].trim()
      const name = parts[1].trim()
      const district = parts[2].trim()
      const state = parts[3].trim()

      if (!pincode || !name) continue

      if (!map[pincode]) {
        map[pincode] = []
      }

      map[pincode].push({
        name,
        district,
        state
      })
    }

    cachedMap = map
    globalRef.__pincodeCache = map
    console.log(`Parsed ${lines.length} lines in ${Date.now() - startTime}ms`)
    return map
  } catch (error) {
    console.error('Failed to parse pincodes CSV:', error)
    return {}
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Valid 6-digit pincode is required.' },
        { status: 400 }
      )
    }

    const dataMap = loadPincodes()
    const records = dataMap[code] || []

    return NextResponse.json({
      success: true,
      records
    })
  } catch (error: any) {
    console.error('Error in pincode GET handler:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
