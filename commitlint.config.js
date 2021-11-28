module.exports = {
  extends: ['cz'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'wip'
      ]
    ],
    'type-empty': [2, 'never']
  }
}
