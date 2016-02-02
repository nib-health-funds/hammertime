require 'json'
require 'fileutils'

class NibArtifacts
  def load_map
    puts 'Cleaning maps'
    FileUtils.rm_rf('./maps')
    `time git clone git@git.nib.com.au:redqueen/ci-artifacts.git maps`
    JSON.parse(IO.read('./maps/nib-aws-map.json'))
  end
end
