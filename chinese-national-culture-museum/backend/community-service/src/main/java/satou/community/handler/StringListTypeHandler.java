package satou.community.handler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * 用于处理数据库逗号分隔字符串与 Java List<String> 之间的转换
 */
@MappedJdbcTypes(JdbcType.VARCHAR) // 数据库字段类型
@MappedTypes(List.class)          // Java 字段类型
public class StringListTypeHandler extends BaseTypeHandler<List<String>> {

    private static final String COMMA = ",";

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<String> parameter, JdbcType jdbcType) throws SQLException {
        // 将 List 转换为逗号分隔的字符串存入数据库 (如果需要反向写入)
        if (parameter == null || parameter.isEmpty()) {
            ps.setString(i, "");
        } else {
            ps.setString(i, String.join(COMMA, parameter));
        }
    }

    @Override
    public List<String> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return parseString(rs.getString(columnName));
    }

    @Override
    public List<String> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return parseString(rs.getString(columnIndex));
    }

    @Override
    public List<String> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return parseString(cs.getString(columnIndex));
    }

    /**
     * 解析逗号分隔的字符串为 List
     */
    private List<String> parseString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return Collections.emptyList();
        }
        // 分割字符串并去除每个元素的首尾空格
        return Arrays.asList(value.split(COMMA));
    }
}