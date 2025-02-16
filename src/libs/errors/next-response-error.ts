import { NextResponse } from 'next/server';

export class NextResponseError {
  static json(message: string, status: number) {
    return NextResponse.json({ message }, { status });
  }

  static unAuthorized() {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  static forbidden() {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  static recordNotFound(message = 'Record not found') {
    return NextResponse.json({ message }, { status: 404 });
  }
}
