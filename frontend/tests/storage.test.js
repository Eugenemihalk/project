import test from 'node:test';
import assert from 'node:assert/strict';
import { readDocuments, writeDocuments } from '../src/data/storage.js';

const example = { id: '1', title: 'План', content: 'Текст', status: 'draft', createdAt: '2026-10-21T10:00:00.000Z', updatedAt: '2026-10-21T10:00:00.000Z' };
const storage = (raw) => ({ getItem: () => raw });

test('отсутствующие данные восстанавливают начальные документы', () => {
  assert.deepEqual(readDocuments(storage(null), [example]), [example]);
});
test('сохранённый пустой список не заменяется примерами', () => {
  assert.deepEqual(readDocuments(storage('[]'), [example]), []);
});
test('повреждённый JSON и неверная структура заменяются примерами', () => {
  for (const raw of ['{broken', 'null', '{}', '[null]', '[{"id":"1"}]', JSON.stringify([{ ...example, status: 'unknown' }]), JSON.stringify([example, example])]) {
    assert.deepEqual(readDocuments(storage(raw), [example]), [example]);
  }
});
test('корректные документы восстанавливаются без изменений', () => {
  assert.deepEqual(readDocuments(storage(JSON.stringify([example])), []), [example]);
});
test('запрет доступа к хранилищу возвращает примеры', () => {
  assert.deepEqual(readDocuments({ getItem() { throw new Error('denied'); } }, [example]), [example]);
});
test('запись сериализует список, ошибка квоты передаётся вызывающему коду', () => {
  let result;
  writeDocuments({ setItem: (key, value) => { result = [key, JSON.parse(value)]; } }, [example]);
  assert.deepEqual(result, ['collab.documents', [example]]);
  assert.throws(() => writeDocuments({ setItem() { throw new Error('quota'); } }, []), /quota/);
});
